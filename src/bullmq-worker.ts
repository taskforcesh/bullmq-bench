import { Benchmark, BenchmarkConfig, BenchmarkReport } from "./benchmark";
import { v4 } from "uuid";
import { Redis } from "ioredis";
import { connection } from "./connection";

import {
  Queue,
  Worker,
  QueueOptions,
  WorkerOptions,
  JobsOptions,
} from "bullmq";
import * as Util from "./util";

const QUEUE_ADD_BULK_SIZE = 100;

const DEFAULT_CONFIG = {
  type: "bullmq-worker-benchmark",
  warmupJobsNum: 100,
  benchmarkJobsNum: 1000,
  jobData: {},
  jobResult: {},
  jobFailedReason: {},
  jobFailureProbability: 0,
};

/*
 * Benchmark to measure performance of the worker against processing of a large number of no-op jobs.
 */
export class BullmqWorkerBenchmark extends Benchmark<
  BullmqWorkerBenchmarkConfig,
  BullmqWorkerBenchmarkReport
> {
  private queue: Queue;
  private worker: Worker;

  private data: any;
  private result: any;
  private failedReason: any;

  constructor(config: BullmqWorkerBenchmarkConfig) {
    super(config, DEFAULT_CONFIG);

    if (!this.config.queueName) {
      this.config.queueName = v4();
    }

    if (this.config.warmupJobsNum < 0) {
      throw new Error("config.warmupJobsNum must be non-negative");
    }
    if (this.config.benchmarkJobsNum < 0) {
      throw new Error("config.benchmarkJobsNum must be non-negative");
    }

    if (
      this.config.jobFailureProbability < 0 ||
      this.config.jobFailureProbability > 1
    ) {
      throw new Error(
        "config.jobFailureProbability must be in interval [0; 1]"
      );
    }
  }

  public async setUp(): Promise<void> {
    this.data = this.config.jobData;
    if (this.config.generateSampleJobData) {
      const { widthFactor, depthFactor } = this.config.generateSampleJobData;
      this.data = Util.generateSampleDataObject(widthFactor, depthFactor);
    }

    this.result = this.config.jobResult;
    if (this.config.generateSampleJobResult) {
      const { widthFactor, depthFactor } = this.config.generateSampleJobResult;
      this.result = Util.generateSampleDataObject(widthFactor, depthFactor);
    }

    this.failedReason = this.config.jobFailedReason;

    const queue = new Queue(this.config.queueName, { connection });
    await queue.waitUntilReady();

    const jobsTotal = this.config.warmupJobsNum + this.config.benchmarkJobsNum;
    let count = 0;

    while (count < jobsTotal) {
      const bulk: {
        name: string;
        data: any;
        opts?: JobsOptions;
      }[] = [];
      for (let i = 0; i < QUEUE_ADD_BULK_SIZE && count < jobsTotal; i++) {
        bulk.push({ name: "test", data: this.data, opts: this.config.jobOpts });
        count++;
      }
      await queue.addBulk(bulk);
    }

    const client = await queue.client;
    this.report.result.redisVersion = await Util.getRedisVersion(client);
    this.queue = queue;
  }

  public async run(): Promise<void> {
    const { result } = this.report;
    const {
      warmupJobsNum,
      benchmarkJobsNum,
      queueName,
      jobFailureProbability,
    } = this.config;
    const jobsTotal = warmupJobsNum + benchmarkJobsNum;
    let count = 0;
    let startTime = 0;

    return new Promise((resolve) => {
      this.worker = new Worker(
        queueName,
        async (job: any) => {
          count++;
          if (count === warmupJobsNum) {
            startTime = Date.now();
          } else if (count === jobsTotal) {
            result.time = Date.now() - startTime;
            result.rate = Math.round((1000 * jobsTotal) / result.time);
            result.rateUnit = "jobs/sec";
            resolve();
          }

          if (jobFailureProbability > 0) {
            if (jobFailureProbability < 1) {
              if (Math.random() <= jobFailureProbability) {
                throw this.failedReason;
              }
            } else {
              // jobFailureProbability === 1
              throw this.failedReason;
            }
          }
          return this.result;
        },
        {
          ...this.config.workerOptions,
          connection,
        }
      );
    });
  }

  public async tearDown(): Promise<void> {
    if (this.queue) {
      const client = await this.queue.client;
      await Util.flushQueueKeys(client as Redis, this.config.queueName);
      await this.queue.close();
    }
    if (this.worker) {
      await this.worker.close();
    }
  }
}

export interface BullmqWorkerBenchmarkConfig extends BenchmarkConfig {
  /*
   * How many jobs to process before start the stopwatch
   */
  warmupJobsNum?: number;

  /*
   * Amount of jobs involved in benchmark itself
   */
  benchmarkJobsNum?: number;

  /*
   * Name of queue to use; random-generated by default
   */
  queueName?: string;

  /*
   * Options to create Queue
   */
  queueOptions?: QueueOptions;

  /*
   * Options used to create Worker
   */
  workerOptions?: WorkerOptions;

  /*
   * Options applied to each created job
   */
  jobOpts?: JobsOptions;

  /*
   * Object to use as a job data
   */
  jobData?: any;

  /*
   * Object to use as a job result; only used if jobFailureProbability < 1
   */
  jobResult?: any;

  /*
   * Object thrown inside the job; only used with jobFailureProbability > 0
   */
  jobFailedReason?: any;

  /*
   * Options to generate sample data object used in every job.
   * Allows to conveniently create large JSON payloads.
   */
  generateSampleJobData?: {
    widthFactor: number;
    depthFactor: number;
  };

  /*
   * The same as generateSampleJobData, but for job result.
   */
  generateSampleJobResult?: {
    widthFactor: number;
    depthFactor: number;
  };

  /*
   * Value from 0 to 1 to randomly fail jobs; when > 0, Math.random() is used in a
   * Worker callback to determine whether particular job fail or not.
   */
  jobFailureProbability?: number;
}

export interface BullmqWorkerBenchmarkReport extends BenchmarkReport {
  config?: BullmqWorkerBenchmarkConfig;

  result: {
    time?: number;
    rate?: number;
    rateUnit?: string;
    redisVersion?: string;
  };
}

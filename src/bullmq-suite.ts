import { Suite } from "./suite";
import { BullmqQueueAddBenchmark } from "./bullmq-queue-add";
import { BullmqWorkerBenchmark } from "./bullmq-worker";

export class BullMQSuite extends Suite {
  constructor() {
    super("BullMQ 4.0");

    this.add(
      new BullmqQueueAddBenchmark({
        name: "queue-add",
        timeout: 30000,
        warmupJobsNum: 1000,
        benchmarkJobsNum: 10000,
        bulkSize: 0,
        generateSampleJobData: {
          widthFactor: 10,
          depthFactor: 10
        }
      })
    );

    this.add(
      new BullmqQueueAddBenchmark({
        name: "queue-add-bulk",
        timeout: 30000,
        warmupJobsNum: 1000,
        benchmarkJobsNum: 10000,
        bulkSize: 100,
        generateSampleJobData: {
          widthFactor: 10,
          depthFactor: 10
        }
      })
    );

    this.add(
      new BullmqWorkerBenchmark({
        name: "worker-generic",
        timeout: 30000,
        warmupJobsNum: 1000,
        benchmarkJobsNum: 10000,
        generateSampleJobData: {
          widthFactor: 10,
          depthFactor: 10
        },
        generateSampleJobResult: {
          widthFactor: 10,
          depthFactor: 10
        }
      })
    );

    this.add(
      new BullmqWorkerBenchmark({
        name: "worker-concurrent",
        timeout: 30000,
        warmupJobsNum: 1000,
        benchmarkJobsNum: 10000,
        generateSampleJobData: {
          widthFactor: 10,
          depthFactor: 10
        },
        generateSampleJobResult: {
          widthFactor: 10,
          depthFactor: 10
        },
        workerOptions: {
          concurrency: 10
        }
      })
    );
  }
}

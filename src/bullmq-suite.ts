import { Suite } from "./suite";
import { BullmqQueueAddBenchmark } from "./bullmq-queue-add";
import { BullmqWorkerBenchmark } from "./bullmq-worker";

const pkg = require("../node_modules/bullmq/package.json");
const bullmqVersion = pkg.version;

export class BullMQSuite extends Suite {
  constructor() {
    super(`BullMQ ${bullmqVersion}`);

    this.add(
      new BullmqQueueAddBenchmark({
        name: "queue-add",
        timeout: 30000,
        warmupJobsNum: 1000,
        benchmarkJobsNum: 1000,
        bulkSize: 0,
        generateSampleJobData: {
          widthFactor: 10,
          depthFactor: 10,
        },
      })
    );

    this.add(
      new BullmqQueueAddBenchmark({
        name: "queue-add-bulk",
        timeout: 30000,
        warmupJobsNum: 1000,
        benchmarkJobsNum: 10000,
        bulkSize: 50,
        generateSampleJobData: {
          widthFactor: 1,
          depthFactor: 1,
        },
      })
    );

    this.add(
      new BullmqWorkerBenchmark({
        name: "worker-generic",
        timeout: 30000,
        warmupJobsNum: 1000,
        benchmarkJobsNum: 1000,
        generateSampleJobData: {
          widthFactor: 1,
          depthFactor: 1,
        },
        generateSampleJobResult: {
          widthFactor: 1,
          depthFactor: 1,
        },
      })
    );

    this.add(
      new BullmqWorkerBenchmark({
        name: "worker-concurrent",
        timeout: 30000,
        warmupJobsNum: 1000,
        benchmarkJobsNum: 10000,
        generateSampleJobData: {
          widthFactor: 1,
          depthFactor: 1,
        },
        generateSampleJobResult: {
          widthFactor: 1,
          depthFactor: 1,
        },
        workerOptions: {
          concurrency: 100,
        },
      })
    );
  }
}

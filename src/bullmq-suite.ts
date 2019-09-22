import { Suite } from "./suite";
import { Queue, Worker } from "bullmq";
import { Benchmark } from "./benchmark";

const queue = new Queue("benchmark");

class AddJobsBenchmark extends Benchmark {
  constructor() {
    super("Add Jobs");
  }

  async start() {
    await queue.waitUntilReady();
    super.start();
  }

  async run() {
    for (let i = 0; i < 100; i++) {
      const adding = [];
      for (let j = 0; j < 100; j++) {
        adding.push(queue.add("paralell", { foo: "bar", i, j }));
      }
      await Promise.all(adding);
    }
  }
}

class ProcessJobsBenchmark extends Benchmark {
  constructor() {
    super("Process Jobs");
  }

  async start() {
    super.start();
  }

  async run() {
    const worker = new Worker(
      "benchmark",
      async job => {
        // Dummy
      },
      {
        concurrency: 5
      }
    );

    await new Promise(resolve => {
      worker.on("drained", resolve);
    });
  }
}

export class BullMQSuite extends Suite {
  constructor() {
    super("BullMQ 4.0");

    this.add(new AddJobsBenchmark());
    this.add(new ProcessJobsBenchmark());
  }
}

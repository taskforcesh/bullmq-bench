import { Benchmark } from "./benchmark";
import { log } from "./log";

export class Suite {
  benchmarks: Benchmark<any, any>[] = [];

  constructor(private name: string) {}

  add(benchmark: Benchmark<any, any>) {
    this.benchmarks.push(benchmark);
  }

  async run() {
    log.info(`Running suite for: ${this.name}`);
    for (let i = 0; i < this.benchmarks.length; i++) {
      const benchmark = this.benchmarks[i];
      const result = await benchmark.execute();
      log.success(`Result for ${benchmark.config.name} : ${JSON.stringify(result)}`);
    }
  }
}

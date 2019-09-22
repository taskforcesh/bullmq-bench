import { Benchmark } from "./benchmark";

export class Suite {
  benchmarks: Benchmark[] = [];

  constructor(private name: string) {}

  add(benchmark: Benchmark) {
    this.benchmarks.push(benchmark);
  }

  async run() {
    console.log(`Running suite: ${this.name}`);
    for (let i = 0; i < this.benchmarks.length; i++) {
      const benchmark = this.benchmarks[i];
      await benchmark.start();
      await benchmark.run();
      await benchmark.end();
    }
  }
}

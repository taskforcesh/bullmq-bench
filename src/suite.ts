import { Benchmark } from "./benchmark";

export class Suite {
  benchmarks: Benchmark<any, any>[] = [];

  constructor(private name: string) {}

  add(benchmark: Benchmark<any, any>) {
    this.benchmarks.push(benchmark);
  }

  async run() {
    console.log(`Running suite: ${this.name}`);
    for (let i = 0; i < this.benchmarks.length; i++) {
      const benchmark = this.benchmarks[i];
      const result = await benchmark.execute();
      console.log(`Result: ${JSON.stringify(result)}`);
    }
  }
}

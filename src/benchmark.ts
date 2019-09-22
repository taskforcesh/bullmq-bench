export abstract class Benchmark {
  startTime: number;

  constructor(private name: string) {}

  async start() {
    console.log(`Starting benchmark: ${this.name}`);
    this.startTime = Date.now();
  }

  abstract async run(): Promise<void>;

  async end() {
    console.log(
      `End benchmark: ${this.name}. Total time: ${Date.now() -
        this.startTime} ms`
    );
  }
}

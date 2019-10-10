import { errorToObject } from "./util";

const DEFAULT_CONFIG = {
  timeout: 10000
};

export abstract class Benchmark<
  C extends BenchmarkConfig,
  R extends BenchmarkReport
> {
  protected aborted = false;
  protected config: C;
  protected report: R = { execution: {}, result: {} } as R;

  constructor(config: C, defaultConfig: any) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...defaultConfig,
      ...config
    };
    if (!this.config.name) {
      throw new Error("config.name is required");
    }
    if (!this.config.type) {
      throw new Error("config.type is required");
    }
    if (this.config.timeout <= 0) {
      throw new Error("config.timeout must be a positive number");
    }
    this.report.config = this.config;
  }

  public async execute(): Promise<R> {
    const { timeout } = this.config;
    return new Promise<R>(async resolve => {
      let timer: NodeJS.Timer;

      const resolveAndClearTimeout = () => {
        clearTimeout(timer);
        resolve({ ...this.report });
      };

      timer = setTimeout(() => {
        this.aborted = true;
        this.report.error = errorToObject(
          new Error("timeout of " + timeout + "ms exceeded")
        );
        resolveAndClearTimeout();
      }, timeout);

      const startTime = Date.now();
      this.report.execution.executedOn = new Date().toISOString();

      try {
        await this.runFlow();
        this.report.execution.finishedOn = new Date().toISOString();
        this.report.execution.totalDuration = Date.now() - startTime;
        resolveAndClearTimeout();
      } catch(error) {
        this.report.execution.finishedOn = new Date().toISOString();
        this.report.execution.totalDuration = Date.now() - startTime;
        this.report.error = errorToObject(error);
        resolveAndClearTimeout(); // always swallow rejections
      }

    });
  };

  public abort(): void {
    this.aborted = true;
  };

  public getConfig(): C {
    return this.config;
  };

  public getReport(): R {
    return this.report;
  };

  protected abstract setUp(): Promise<void>;
  protected abstract run(): Promise<void>;
  protected abstract tearDown(): Promise<void>;

  private async runFlow(): Promise<void> {
    try {
      if (this.aborted) {
        throw new Error("aborted");
      }
      const setUpTime = Date.now();
      await this.setUp();
      this.report.execution.setUpDuration = Date.now() - setUpTime;
      if (this.aborted) {
        throw new Error("aborted");
      }
      const runTime = Date.now();
      await this.run();
      this.report.execution.runDuration = Date.now() - runTime;
    } finally {
      const tearDownTime = Date.now();
      await this.tearDown();
      this.report.execution.tearDownDuration = Date.now() - tearDownTime;
    }
  };
}

export interface BenchmarkConfig {
  name: string;
  type?: string;
  timeout?: number; // milliseconds
}

export interface BenchmarkReport {
  /*
   * Config used to run benchmark
   */
  config?: BenchmarkConfig;
  /*
   * Common execution stats
   */
  execution: {
    executedOn?: string;
    finishedOn?: string;
    totalDuration?: number;
    setUpDuration: number;
    runDuration?: number;
    tearDownDuration?: number;
  };
  /*
   * All benchmark-specific measurements go here
   */
  result: {};
  /*
   * Used to save reason of benchmark failure
   */
  error?: {
    stack?: string[];
    message?: string;
  };
}

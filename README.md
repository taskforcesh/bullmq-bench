# BullMQ Benchmark Suite

This repository contains a benchmark suite for [BullMQ](https://bullmq.io). 
Its main use is to compare the performance of BullMQ between versions, NodeJS/Bun runtimes as well as different Redis versions, configurations and backends.

## Running the benchmarks

The benchmark suite is very simple to run, just clone the repository and run `yarn install` or `bun install` to install the dependencies.

Then you can run the benchmarks with `yarn start` or `bun src/index.ts`.

## Redis

The benchmark suite expects a running Redis server on `localhost:6379` by default, but this can easily be configured using env variables.

```bash
  BULLMQ_BENCH_REDIS_HOST
  BULLMQ_BENCH_REDIS_PORT
  BULLMQ_BENCH_REDIS_PASSWORD
  BULLMQ_BENCH_ENABLE_PIPELINE
  ```


## License

Copyright 2023 Taskforce.sh Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

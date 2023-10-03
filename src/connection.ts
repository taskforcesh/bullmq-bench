import { RedisOptions } from "bullmq";

export const connection: RedisOptions = {
  host: process.env.BULLMQ_BENCH_REDIS_HOST || "",
  port: parseInt(process.env.BULLMQ_BENCH_REDIS_PORT || "6379", 10),
  password: process.env.BULLMQ_BENCH_REDIS_PASSWORD || "",
  enableAutoPipelining: !!process.env.BULLMQ_BENCH_ENABLE_PIPELINE || false,
};

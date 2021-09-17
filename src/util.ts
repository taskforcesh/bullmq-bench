import Uuid from "uuid";
import { Cluster, Redis } from 'ioredis';

type RedisClient = Redis | Cluster;

export const flushQueueKeys = (ioredis: RedisClient, queueName: string) => {
  const pattern = `bull:${queueName}:*`;
  return new Promise<void>((resolve, reject) => {
    const stream = ioredis.scanStream({
      match: pattern
    });
    stream.on("data", (keys: string[]) => {
      if (keys.length) {
        const pipeline = ioredis.pipeline();
        keys.forEach(key => {
          pipeline.del(key);
        });
        pipeline.exec();
      }
    });
    stream.on("end", () => {
      resolve();
    });
    stream.on("error", (e: Error) => {
      reject(e);
    });
  });
};

export const errorToObject = (error: any) => {
  if (!error) {
    return {};
  }
  if (typeof error === "string") {
    return { message: error };
  }

  // handle cases when "error" is not an Error, example: Axios.Cancel
  const name = error.name || (error.constructor && error.constructor.name);

  const message = error.message ? `${name}: ${error.message}` : name;
  const stack = parseStackTrace(error.stack);
  const result: any = {};
  if (stack) {
    result.stack = stack;
  }
  if (stack) {
    result.message = message;
  }
  return result;
};

export const parseStackTrace = (stack: string) => {
  if (stack) {
    const array = stack.split(/\n {4}at /g);
    array.shift();
    return array;
  }
  return [];
};

export const generateSampleDataObject = (
  widthFactor = 1,
  depthFactor = 1
): any => {
  const result: any = {};
  if (widthFactor < 0) {
    throw new Error("widthFactor must be non-negative");
  }
  if (depthFactor <= 0) {
    throw new Error("depthFactor must be a positive number");
  }

  for (let i = 0; i < widthFactor; i++) {
    let object: any = {};
    result[Uuid.v4()] = object;
    for (let j = 1; j < depthFactor; j++) {
      const inner: any = {};
      object[Uuid.v4()] = inner;
      object = inner;
    }
  }
  return result;
};

export const getRedisVersion = async (ioredis: RedisClient): Promise<string> => {
  const doc = await ioredis.info();
  const prefix = "redis_version:";
  const lines = doc.split("\r\n");

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].indexOf(prefix) === 0) {
      return lines[i].substr(prefix.length);
    }
  }
};

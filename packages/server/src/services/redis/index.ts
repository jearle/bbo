import * as Redis from 'ioredis';

export interface RedisOptions {
  uri: string;
}

export const createRedisService = ({ uri }: RedisOptions): Redis => {
  const redisService = new Redis(uri);

  redisService.close = redisService.end;

  return redisService;
};

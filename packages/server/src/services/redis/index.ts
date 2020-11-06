import * as Redis from 'ioredis';

export interface RedisOptions {
  uri: string;
}

export const createRedisService = ({ uri }: RedisOptions): Redis => {
  const client = new Redis(uri);

  return client;
};

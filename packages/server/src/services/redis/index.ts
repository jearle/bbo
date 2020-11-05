import * as Redis from 'ioredis';

interface Options {
  uri: string;
}

export const createRedisClient = ({ uri }: Options): Redis => {
  const client = new Redis(uri);

  return client;
};

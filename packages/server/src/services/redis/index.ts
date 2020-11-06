import * as Redis from 'ioredis';

export interface Options {
  uri: number;
}

export const createRedisClient = ({ uri }: Options): Redis => {
  const client = new Redis(uri);
  
  return client;
};

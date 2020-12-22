import * as Redis from 'ioredis';

type CreateRedisServiceInput = {
  uri: string;
};

export const createRedisProvider = ({
  uri,
}: CreateRedisServiceInput): Redis => {
  const redisService = new Redis(uri);

  redisService.close = redisService.end;

  return redisService;
};

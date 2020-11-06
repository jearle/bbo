import { createRedisClient } from '.';

const { REDIS_URI } = process.env;

test(`createRedisClient`, () => {
  const redisClient = createRedisClient({ uri: Number(REDIS_URI) });

  redisClient.end();
});

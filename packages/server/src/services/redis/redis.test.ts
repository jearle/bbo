import { createRedisClient } from '.';

const { REDIS_URI } = process.env;

test(`createRedisClient`, () => {
  const redisClient = createRedisClient({ uri: REDIS_URI });

  redisClient.end();
});

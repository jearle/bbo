import { v4 as uuid } from 'uuid';
import { createRedisClient } from '.';

const { REDIS_URI } = process.env;

test(`createRedisClient`, async () => {
  const redisClient = createRedisClient({ uri: REDIS_URI });
  const id = uuid();

  await redisClient.set(id, `bar`);

  const result = await redisClient.get(id);
  expect(result).toBe(`bar`);

  await redisClient.del(id);

  redisClient.end();
});

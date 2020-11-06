import { v4 as uuid } from 'uuid';
import { createRedisService } from '.';

const { REDIS_URI } = process.env;

test(`createRedisService`, async () => {
  const redisClient = createRedisService({ uri: REDIS_URI });
  const id = uuid();

  await redisClient.set(id, `bar`);

  const result = await redisClient.get(id);
  expect(result).toBe(`bar`);

  await redisClient.del(id);

  redisClient.end();
});

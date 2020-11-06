import { v4 as uuid } from 'uuid';
import { createRedisService } from '.';

const { REDIS_URI } = process.env;

test(`createRedisService`, async () => {
  const redisService = createRedisService({ uri: REDIS_URI });
  const id = uuid();

  await redisService.set(id, `bar`);

  const result = await redisService.get(id);
  expect(result).toBe(`bar`);

  await redisService.del(id);

  redisService.end();
});

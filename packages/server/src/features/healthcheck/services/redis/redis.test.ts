import { createRedisProvider } from '../../../../providers/redis';
import { createRedisHealthService } from './';

const { REDIS_URI } = process.env;

test('healthy redis health service', async () => {
  const healthService = await createRedisHealthService({
    createRedisProvider: async () =>
      await createRedisProvider({ uri: REDIS_URI }),
  });
  const { status } = await healthService.health();
  expect(status).toBe(0);
});

test('redis provider does not respond correct to ping', async () => {
  const healthService = await createRedisHealthService({
    createRedisProvider: async () => ({
      ping: jest.fn().mockReturnValue('BOOM'),
      close: jest.fn(),
    }),
  });
  const { status } = await healthService.health();
  expect(status).toBe(1);
});

test('unhealthy redis health service', async () => {
  const healthService = await createRedisHealthService({
    createRedisProvider: async () => {
      throw new Error();
    },
  });
  const { status } = await healthService.health();
  expect(status).toBe(1);
});

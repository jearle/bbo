import {
  HealthStatus,
  createHealthyStatus,
  createUnhealthyStatus,
} from '../../helpers/health-status';

const SERVICE_NAME = 'Redis';

type RedisHealthServiceInput = {
  readonly createRedisProvider;
};

const redisHealthService = ({
  createRedisProvider,
}: RedisHealthServiceInput) => ({
  async health(): Promise<HealthStatus> {
    let redisProvider = null;
    try {
      redisProvider = await createRedisProvider();
      const result = await redisProvider.ping();
      if (result !== 'PONG') {
        return createUnhealthyStatus(SERVICE_NAME);
      }
      return createHealthyStatus(SERVICE_NAME);
    } catch (error) {
      return createUnhealthyStatus(SERVICE_NAME);
    } finally {
      if (redisProvider) {
        await redisProvider.close();
      }
    }
  },
});

export type RedisHealthService = ReturnType<typeof redisHealthService>;

export const createRedisHealthService = ({
  createRedisProvider,
}: RedisHealthServiceInput): RedisHealthService => {
  return redisHealthService({ createRedisProvider });
};

type RedisHealthServiceInput = {
  readonly createRedisProvider;
};

const redisHealthService = ({
  createRedisProvider,
}: RedisHealthServiceInput) => ({
  async health() {
    const healthResult = {
      name: 'Redis',
      status: 0,
      msg: 'ok',
    };
    let redisProvider = null;
    try {
      redisProvider = await createRedisProvider();
      const result = await redisProvider.ping();
      if (result !== 'PONG') {
        healthResult.status = 1;
        healthResult.msg = `${healthResult.name} is unhealty`;
      }
      return healthResult;
    } catch (error) {
      return {
        ...healthResult,
        status: 1,
        msg: `${healthResult.name} threw error: ${error.message}`,
      };
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

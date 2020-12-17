import { createRedisProvider } from '.';

const { REDIS_URI: uri } = process.env;

test(`createMSSQLProvider`, async () => {
  const pool = await createRedisProvider({
    uri,
  });

  await pool.close();
});

const sql = require('mssql');

export interface RCAWebOptions {
  username: string;
  password: string;
  server: string;
}

const createMSSqlOptions = ({ username, password, server }: RCAWebOptions) => ({
  user: username,
  password,
  server,
  database: `dbRCAWeb`,
  connectionTimeout: 5000,
  pool: {
    min: 1,
    max: 10,
    idleTimeoutMillis: 10000,
  },
});

export const createRCAWebService = async (options: RCAWebOptions) => {
  const mssqlOptions = createMSSqlOptions(options);
  const pool = await sql.connect(mssqlOptions);

  return pool;
};

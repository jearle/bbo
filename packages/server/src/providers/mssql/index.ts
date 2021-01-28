import * as mssql from 'mssql';
import { resolve as resolveConnectionString } from 'mssql/lib/connectionstring';

type CreateMSSQLProviderInput = {
  readonly uri: string;
};

type createMSSQLConnectionOptionsInput = {
  readonly uri: string;
  readonly database: string;
};

type ConnectInput = {
  readonly database: string;
};

const createMSSQLConnectionOptions = ({
  uri,
  database,
}: createMSSQLConnectionOptionsInput) => {
  const { user, password, server } = resolveConnectionString(uri);

  return {
    user,
    password,
    server,
    database,
    connectionTimeout: 5000,
    encrypt: false,
    pool: {
      min: 1,
      max: 10,
      idleTimeoutMillis: 10000,
    },
    options: {
      encrypt: false,
      enableArithAbort: true,
    },
  };
};

const mssqlProvider = ({ uri }) => ({
  async connect({ database }: ConnectInput) {
    const mssqlConnectionOptions = createMSSQLConnectionOptions({
      uri,
      database,
    });

    const connectionPool = new mssql.ConnectionPool(mssqlConnectionOptions);
    const connection = await connectionPool.connect();

    return connection;
  },

  types() {
    return mssql.TYPES;
  },
});

export type MSSQLProvider = ReturnType<typeof mssqlProvider>;

export const createMSSQLProvider = ({
  uri,
}: CreateMSSQLProviderInput): MSSQLProvider => {
  return mssqlProvider({ uri });
};

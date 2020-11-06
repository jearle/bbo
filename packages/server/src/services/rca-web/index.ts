import * as mssql from 'mssql';
import { resolve as resolveConnectionString } from 'mssql/lib/connectionstring';

export interface RCAWebOptions {
  uri: string;
}

const createMSSqlOptions = ({ uri }: RCAWebOptions) => {
  const { user, password, server } = resolveConnectionString(uri);

  return {
    user,
    password,
    server,
    database: `dbRCAWebAccounts`,
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

export interface RCAWebService {
  connectionPool: Function;
  types: Function;
  close: Function;
}

export const createRCAWebService = (options: RCAWebOptions): RCAWebService => {
  const mssqlOptions = createMSSqlOptions(options);

  const connectionPoolPromise = mssql.connect(mssqlOptions);

  return {
    connectionPool: async () => {
      const connectionPool = await connectionPoolPromise;

      return connectionPool;
    },

    types() {
      return mssql.TYPES;
    },

    close: async () => {
      const connectionPool = await connectionPoolPromise;

      connectionPool.close();
    },
  };
};

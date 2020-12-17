import { MSSQLProvider } from '../../../../providers/mssql';

const DATABASE = `dbRCAWebAccounts`;

type CreateRCAWebAccountsHealthServiceInput = {
  readonly mssqlProvider: MSSQLProvider;
};

const rcaWebAccountsHealthService = ({ rcaWebAccountsConnection }) => ({
  async health() {
    const health = {
      name: 'RCAWebAccounts',
      status: 0,
      msg: 'ok',
    };
    try {
      const result = await rcaWebAccountsConnection
        .request()
        .query('SELECT 0 AS status');

      if (result.recordset[0].status !== 0) {
        health.status = 1;
        health.msg = `${health.name} is unhealthy`;
      }

      return health;
    } catch (error) {
      return {
        ...health,
        status: 1,
        msg: `${health.name} threw error: ${error.message}`,
      };
    }
  },

  async close() {
    await rcaWebAccountsConnection.close();
  },
});

export type RCAWebAccountsHealthService = ReturnType<
  typeof rcaWebAccountsHealthService
>;

export const createRCAWebAccountsHealthService = async ({
  mssqlProvider,
}: CreateRCAWebAccountsHealthServiceInput): Promise<RCAWebAccountsHealthService> => {
  const rcaWebAccountsConnection = await mssqlProvider.connect({
    database: DATABASE,
  });

  return rcaWebAccountsHealthService({
    rcaWebAccountsConnection,
  });
};

import { MSSQLProvider } from '../../../../providers/mssql';

const DATABASE = `dbRCAWebAccounts`;

type CreateRCAWebAccountsHealthServiceInput = {
  readonly mssqlProvider: MSSQLProvider;
};

const rcaWebAccountsHealthService = ({ createRcaWebAccountsConnection }) => ({
  async health() {
    const health = {
      name: 'RCAWebAccounts',
      status: 0,
      msg: 'ok',
    };
    let connection = null;
    try {
      connection = await createRcaWebAccountsConnection();
      const result = await connection.request().query('SELECT 0 AS status');

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
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  },
});

export type RCAWebAccountsHealthService = ReturnType<
  typeof rcaWebAccountsHealthService
>;

export const createRCAWebAccountsHealthService = async ({
  mssqlProvider,
}: CreateRCAWebAccountsHealthServiceInput): Promise<RCAWebAccountsHealthService> => {
  const createRcaWebAccountsConnection = async () => {
    return await mssqlProvider.connect({
      database: DATABASE,
    });
  };

  return rcaWebAccountsHealthService({
    createRcaWebAccountsConnection,
  });
};

import { MSSQLProvider } from '../../../../providers/mssql';

const DATABASE = `dbRCAWebAccounts`;

type CreateRCAWebAccountsHealthServiceInput = {
  readonly mssqlProvider: MSSQLProvider;
};

const rcaWebAccountsHealthService = ({ createRcaWebAccountsConnection }) => ({
  async health() {
    const healthStatus = {
      name: 'RCAWebAccounts',
      status: 0,
      msg: 'ok',
    };
    let connection = null;
    try {
      connection = await createRcaWebAccountsConnection();
      await connection.request().query('SELECT 0 AS status');
      return healthStatus;
    } catch (error) {
      return {
        ...healthStatus,
        status: 1,
        msg: `${healthStatus.name} threw error: ${error.message}`,
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

import { MSSQLProvider } from '../../../../providers/mssql';
import {
  HealthStatus,
  createHealthyStatus,
  createUnhealthyStatus,
} from '../../helpers/health-status';

const DATABASE = `dbRCAWebAccounts`;
const SERVICE_NAME = 'RCAWebAccounts';

type CreateRCAWebAccountsHealthServiceInput = {
  readonly mssqlProvider: MSSQLProvider;
};

const rcaWebAccountsHealthService = ({ createRcaWebAccountsConnection }) => ({
  async health(): Promise<HealthStatus> {
    let connection = null;
    try {
      connection = await createRcaWebAccountsConnection();
      const result = await connection
        .request()
        .query(
          'SELECT TOP (1) 1 AS status FROM [dbRCAWebAccounts].[dbo].[AccountUser]'
        );

      if (result.recordset[0].status !== 1) {
        return createHealthyStatus(SERVICE_NAME);
      }

      return createHealthyStatus(SERVICE_NAME);
    } catch (error) {
      return createUnhealthyStatus(SERVICE_NAME);
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

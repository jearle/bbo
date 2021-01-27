import { MSSQLProvider } from '../../../../providers/mssql';
import {
  HealthStatus,
  createHealthyStatus,
  createUnhealthyStatus,
} from '../../helpers/health-status';

const DATABASE = `dbRCAAnalyticsData`;
const SERVICE_NAME = 'RCAAnalyticsData';

type CreateRCAAnalyticsDataHealthServiceInput = {
  readonly mssqlProvider: MSSQLProvider;
};

const rcaAnalyticsDataHealthService = ({
  createRcaAnalyticsDataConnection,
}) => ({
  async health(): Promise<HealthStatus> {
    let connection = null;
    try {
      connection = await createRcaAnalyticsDataConnection();
      await connection
        .request()
        .query(
          'SELECT TOP (1) 1 AS status FROM [dbRCAAnalyticsData].[dbo].[TrendtrackerData_Geography]'
        );
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

export type RCAAnalyticsDataHealthService = ReturnType<
  typeof rcaAnalyticsDataHealthService
>;

export const createRCAAnalyticsDataHealthService = async ({
  mssqlProvider,
}: CreateRCAAnalyticsDataHealthServiceInput): Promise<RCAAnalyticsDataHealthService> => {
  const createRcaAnalyticsDataConnection = async () => {
    return await mssqlProvider.connect({
      database: DATABASE,
    });
  };

  return rcaAnalyticsDataHealthService({
    createRcaAnalyticsDataConnection,
  });
};

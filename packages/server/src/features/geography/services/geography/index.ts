import { MSSQLProvider } from '../../../../providers/mssql';

const DATABASE = `dbRCAAnalyticsData`;
const STORED_PROCEDURE = `[${DATABASE}].[dbo].[ReturnTrendtrackerData_Geography]`;

type CreateGeographyServiceInput = {
  readonly mssqlProvider: MSSQLProvider;
};

const geographyService = ({ rcaAnalyticsDataConnection }) => ({
  async fetchGeographies() {
    const result = await rcaAnalyticsDataConnection
      .request()
      .execute(STORED_PROCEDURE);

    return result.recordsets[0];
  },

  async close() {
    await rcaAnalyticsDataConnection.close();
  },
});

export type GeographyService = ReturnType<typeof geographyService>;

export const createGeographyService = async ({
  mssqlProvider,
}: CreateGeographyServiceInput): Promise<GeographyService> => {
  const rcaAnalyticsDataConnection = await mssqlProvider.connect({
    database: DATABASE,
  });
  return geographyService({ rcaAnalyticsDataConnection });
};

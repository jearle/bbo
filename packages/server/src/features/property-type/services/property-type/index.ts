import { MSSQLProvider } from '../../../../providers/mssql';

const DATABASE = `dbRCAAnalyticsData`;
const STORED_PROCEDURE = `[${DATABASE}].[dbo].[ReturnTrendtrackerData_PropertyTypes]`;

type CreatePropertyTypeServiceInput = {
  readonly mssqlProvider: MSSQLProvider;
};

const propertyTypeService = ({ rcaAnalyticsDataConnection }) => ({
  async fetchPropertyTypes() {
    const result = await rcaAnalyticsDataConnection
      .request()
      .execute(STORED_PROCEDURE);

    return result.recordsets[0];
  },

  async close() {
    await rcaAnalyticsDataConnection.close();
  },
});

export type PropertyTypeService = ReturnType<typeof propertyTypeService>;

export const createPropertyTypeService = async ({
  mssqlProvider,
}: CreatePropertyTypeServiceInput): Promise<PropertyTypeService> => {
  const rcaAnalyticsDataConnection = await mssqlProvider.connect({
    database: DATABASE,
  });
  return propertyTypeService({ rcaAnalyticsDataConnection });
};

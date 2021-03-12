import { MSSQLProvider } from '../../../../providers/mssql';
import { createPropertyMenu } from '../../helpers/property-menu-builder';

const DATABASE = `dbRCAAnalyticsData`;
const STORED_PROCEDURE = `[${DATABASE}].[dbo].[ReturnTrendtrackerData_PropertyTypes]`;

type CreatePropertyTypeServiceInput = {
  readonly mssqlProvider: MSSQLProvider;
};

const propertyTypeService = ({ rcaAnalyticsDataConnection }) => ({

  async fetchPropertyTypesMenu() {
    const result = await rcaAnalyticsDataConnection
      .request()
      .execute(STORED_PROCEDURE)

    return createPropertyMenu(result.recordsets[0])
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

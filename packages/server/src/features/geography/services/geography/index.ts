import { FlatGeographies, GeographyMenu } from '../../helpers/types';
import { toGeographyMenu } from '../../helpers/menu';
import { MSSQLProvider } from '../../../../providers/mssql';

const DATABASE = `dbRCAAnalyticsData`;
const STORED_PROCEDURE = `[${DATABASE}].[dbo].[ReturnTrendtrackerData_Geography]`;

type CreateGeographyServiceInput = {
  readonly mssqlProvider: MSSQLProvider;
};

type DatabaseResult = {
  readonly recordsets: [FlatGeographies];
};

const geographyService = ({ rcaAnalyticsDataConnection }) => ({
  async fetchGeographies(): Promise<GeographyMenu> {
    const {
      recordsets: [flatGeographies],
    } = (await rcaAnalyticsDataConnection
      .request()
      .execute(STORED_PROCEDURE)) as DatabaseResult;

    const geographyMenu = toGeographyMenu({ flatGeographies });

    return geographyMenu;
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

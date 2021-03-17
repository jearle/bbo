import { MSSQLProvider } from '../../../../providers/mssql';
import { createPropertyTypeMenu, PropertyTypeMenu } from '../../helpers/property-menu-builder';

const DATABASE = `dbRCAAnalyticsData`;
const STORED_PROCEDURE = `[${DATABASE}].[dbo].[ReturnTrendtrackerData_PropertyTypes]`;

type CreatePropertyTypeServiceInput = {
  readonly mssqlProvider: MSSQLProvider;
  readonly redisProvider;
};

type UpdateCacheWithPropertyTypeMenu = {
  readonly redisProvider;
  propertyTypeMenu: PropertyTypeMenu
}

type CheckCacheForPropertyTypeMenu = {
  readonly redisProvider;
}

const propertyTypeMenuCacheKey = 'propertyTypeMenu';

const checkCacheForPropertyTypeMenu = async ({ redisProvider }: CheckCacheForPropertyTypeMenu) => {
  const cachedPropertyTypeMenu = await redisProvider.get(propertyTypeMenuCacheKey);
  if (cachedPropertyTypeMenu) return JSON.parse(cachedPropertyTypeMenu);

  return null;
};

const updateCacheWithPropertyTypeMenu = async ({
  redisProvider,
  propertyTypeMenu,
}: UpdateCacheWithPropertyTypeMenu) => {
  await redisProvider.set(propertyTypeMenuCacheKey, JSON.stringify(propertyTypeMenu));
};

const propertyTypeService = ({
  rcaAnalyticsDataConnection,
  redisProvider,
}) => ({
  async fetchPropertyTypesMenu() {
    const cachedPropertyTypeMenu = await checkCacheForPropertyTypeMenu({
      redisProvider,
    });

    if (cachedPropertyTypeMenu) return cachedPropertyTypeMenu;

    const result = await rcaAnalyticsDataConnection
      .request()
      .execute(STORED_PROCEDURE);
    const propertyTypeMenu = createPropertyTypeMenu(result.recordsets[0]);
    await updateCacheWithPropertyTypeMenu({ redisProvider, propertyTypeMenu });
    return propertyTypeMenu;
  },

  async close() {
    await rcaAnalyticsDataConnection.close();
  },
});

export type PropertyTypeService = ReturnType<typeof propertyTypeService>;

export const createPropertyTypeService = async ({
  mssqlProvider,
  redisProvider,
}: CreatePropertyTypeServiceInput): Promise<PropertyTypeService> => {
  const rcaAnalyticsDataConnection = await mssqlProvider.connect({
    database: DATABASE,
  });
  return propertyTypeService({ rcaAnalyticsDataConnection, redisProvider });
};

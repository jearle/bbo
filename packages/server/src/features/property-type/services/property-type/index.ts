import { PropertyType } from '../../types';
import { toPropertyTypes } from '../../helpers/to-property-types';
import { MSSQLProvider } from '../../../../providers/mssql';

const DATABASE = `dbRCAWeb`;
const STORED_PROCEDURE = `[${DATABASE}].[dbo].[ReturnPropertyTypeMenu_PTS]`;
const CACHED_PROPERTY_TYPES_KEY = `cachedPropertyTypesKey`;

type CreatePropertyTypeServiceInput = {
  readonly mssqlProvider: MSSQLProvider;
  readonly redisProvider;
};

type SetCachedPropertyTypesInput = {
  readonly redisProvider;
  readonly propertyTypes: PropertyType[];
};

type GetCachedPropertyTypesInput = {
  readonly redisProvider;
};

type GetCachedPropertyTypesResult = {
  readonly cachedPropertyTypes: PropertyType[] | null;
};

const getCachedPropertyTypes = async ({
  redisProvider,
}: GetCachedPropertyTypesInput): Promise<GetCachedPropertyTypesResult> => {
  const cachedPropertyTypes =
    (await redisProvider.get(CACHED_PROPERTY_TYPES_KEY)) || null;

  return { cachedPropertyTypes };
};

const setCachedPropertyTypes = async ({
  redisProvider,
  propertyTypes,
}: SetCachedPropertyTypesInput): Promise<void> => {
  const propertyTypesString = JSON.stringify(propertyTypes);

  await redisProvider.set(CACHED_PROPERTY_TYPES_KEY, propertyTypesString);
};

const propertyTypeService = ({
  rcaAnalyticsDataConnection,
  redisProvider,
}) => ({
  async fetchPropertyTypes() {
    const { cachedPropertyTypes } = await getCachedPropertyTypes({
      redisProvider,
    });

    if (cachedPropertyTypes !== null) return cachedPropertyTypes;

    const {
      recordsets: [rawPropertyTypes],
    } = await rcaAnalyticsDataConnection.request().execute(STORED_PROCEDURE);

    const propertyTypes = toPropertyTypes({ rawPropertyTypes });

    await setCachedPropertyTypes({ redisProvider, propertyTypes });

    return propertyTypes;
  },

  async clearCachedPropertyTypes() {
    await redisProvider.del(CACHED_PROPERTY_TYPES_KEY);
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

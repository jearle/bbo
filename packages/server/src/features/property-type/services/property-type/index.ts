import { PropertyType } from '../../types';
import { toPropertyTypes } from '../../helpers/to-property-types';
import { MSSQLProvider } from '../../../../providers/mssql';

const DATABASE = `dbRCAWeb`;
const STORED_PROCEDURE = `[${DATABASE}].[dbo].[ReturnPropertyTypeMenu_PTS]`;

const CACHED_PROPERTY_TYPES_KEY = `cachedPropertyTypesKey`;
const CACHED_SLUG_ID_MAPS = `cachedSlugIdMaps`;

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

type CreateSlugIdMapsInput = {
  readonly propertyTypes: PropertyType[];
};

type SetCachedSlugIdMapsInput = {
  readonly redisProvider;
  readonly slugIdMaps: SlugIdMaps;
};

type GetCachedSlugIdMapsInput = {
  readonly redisProvider;
};

type GetCachedSlugIdMapsResult = {
  readonly cachedSlugIdMaps: SlugIdMaps;
};

type SlugToIdMap = {
  [key: string]: number;
};

type IDToSlugMap = {
  [key: number]: string;
};

type SlugIdMaps = {
  readonly slugToIdMap: SlugToIdMap;
  readonly idToSlugMap: IDToSlugMap;
};

type SlugForIdInput = { readonly id: number };
type IdForSlugInput = { readonly slug: string };

const getCachedPropertyTypes = async ({
  redisProvider,
}: GetCachedPropertyTypesInput): Promise<GetCachedPropertyTypesResult> => {
  const cachedPropertyTypesString =
    (await redisProvider.get(CACHED_PROPERTY_TYPES_KEY)) || null;

  const cachedPropertyTypes = JSON.parse(cachedPropertyTypesString);

  return { cachedPropertyTypes };
};

const setCachedPropertyTypes = async ({
  redisProvider,
  propertyTypes,
}: SetCachedPropertyTypesInput): Promise<void> => {
  const propertyTypesString = JSON.stringify(propertyTypes);

  await redisProvider.set(CACHED_PROPERTY_TYPES_KEY, propertyTypesString);
};

const getCachedSlugIdMaps = async ({
  redisProvider,
}: GetCachedSlugIdMapsInput): Promise<GetCachedSlugIdMapsResult> => {
  const cachedSlugIdMapsString =
    (await redisProvider.get(CACHED_SLUG_ID_MAPS)) || null;

  const cachedSlugIdMaps = JSON.parse(cachedSlugIdMapsString);

  return { cachedSlugIdMaps };
};

const setCachedSlugIdMaps = async ({
  redisProvider,
  slugIdMaps,
}: SetCachedSlugIdMapsInput): Promise<void> => {
  const slugIdMapsString = JSON.stringify(slugIdMaps);

  await redisProvider.set(CACHED_SLUG_ID_MAPS, slugIdMapsString);
};

const createSlugIdMaps = ({
  propertyTypes,
}: CreateSlugIdMapsInput): SlugIdMaps => {
  const slugToIdMap = {};
  const idToSlugMap = {};

  let queue = [...propertyTypes];
  let current = null;

  while ((current = queue.shift())) {
    if (current?.featureTypes?.length > 0)
      queue = [...queue, ...current.featureTypes];
    if (current?.subPropertyTypes?.length > 0)
      queue = [...queue, ...current.subPropertyTypes];

    const { slug, id } = current;
    const integerId = parseInt(id);

    slugToIdMap[slug] = integerId;
    idToSlugMap[integerId] = slug;
  }

  return { slugToIdMap, idToSlugMap };
};

const fetchSlugIdMaps = async ({
  redisProvider,
  propertyTypeService: inPropertyTypeService,
}) => {
  const { cachedSlugIdMaps } = await getCachedSlugIdMaps({ redisProvider });

  if (cachedSlugIdMaps !== null) return cachedSlugIdMaps;

  const propertyTypes = await inPropertyTypeService.fetchPropertyTypes();

  const slugIdMaps = createSlugIdMaps({ propertyTypes });

  await setCachedSlugIdMaps({ redisProvider, slugIdMaps });

  return slugIdMaps;
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

  async idForSlug({ slug }: IdForSlugInput): Promise<number> {
    const { slugToIdMap } = await fetchSlugIdMaps({
      redisProvider,
      propertyTypeService: this,
    });

    return slugToIdMap[slug];
  },

  async slugForId({ id }: SlugForIdInput): Promise<string> {
    const { idToSlugMap } = await fetchSlugIdMaps({
      redisProvider,
      propertyTypeService: this,
    });

    return idToSlugMap[id];
  },

  async clearSlugIdMaps() {
    await redisProvider.del(CACHED_SLUG_ID_MAPS);
  },

  async clearCachedPropertyTypes() {
    await redisProvider.del(CACHED_PROPERTY_TYPES_KEY);
  },

  async clearAllCaches() {
    this.clearSlugIdMaps();
    this.clearCachedPropertyTypes();
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

import { PropertyType, PropertySubType, FeatureType } from '../../types';
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

type SlugToParentSlugMap = {
  [key: string]: string;
};

type ParentSlugToSlugsMap = {
  [key: string]: string[];
};

type ParentSlugToPropertySubSlugsMap = {
  [key: string]: string[];
};

type SlugIdMaps = {
  readonly slugToIdMap: SlugToIdMap;
  readonly idToSlugMap: IDToSlugMap;
  readonly slugToParentSlugMap: SlugToParentSlugMap;
  readonly parentSlugToSlugsMap: ParentSlugToSlugsMap;
  readonly parentSlugToPropertySubSlugsMap: ParentSlugToPropertySubSlugsMap;
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

type SeparateTypesResult = {
  readonly propertyTypes: PropertyType[];
  readonly propertySubTypes: PropertySubType[];
  readonly featureTypes: FeatureType[];
};

const separateTypes = ({ propertyTypes }): SeparateTypesResult => {
  let featureTypes = [];
  let propertySubTypes = [];

  let queue = [...propertyTypes];
  let current = null;

  while ((current = queue.shift())) {
    if (current?.featureTypes?.length > 0) {
      featureTypes = [...featureTypes, ...current.featureTypes];
      queue = [...queue, ...current.featureTypes];
    }

    if (current?.propertySubTypes?.length > 0) {
      propertySubTypes = [...propertySubTypes, ...current.propertySubTypes];
      queue = [...queue, ...current.propertySubTypes];
    }
  }

  return {
    propertyTypes,
    propertySubTypes,
    featureTypes,
  };
};

const createSlugIdMaps = ({
  propertyTypes,
}: CreateSlugIdMapsInput): SlugIdMaps => {
  const { propertySubTypes, featureTypes } = separateTypes({ propertyTypes });

  const { slugToIdMap, idToSlugMap } = [
    ...propertyTypes,
    ...propertySubTypes,
    ...featureTypes,
  ].reduce(
    (acc, next) => {
      const { slugToIdMap, idToSlugMap } = acc;
      const { slug, id } = next;
      const integerId = parseInt(id);

      return {
        slugToIdMap: { ...slugToIdMap, [slug]: integerId },
        idToSlugMap: { ...idToSlugMap, [integerId]: slug },
      };
    },
    {
      slugToIdMap: {},
      idToSlugMap: {},
    }
  );

  const { slugToParentSlugMap } = [...propertySubTypes, ...featureTypes].reduce(
    (acc, next) => {
      const { slugToParentSlugMap } = acc;
      const { slug, parentSlug } = next;

      return {
        slugToParentSlugMap: { ...slugToParentSlugMap, [slug]: parentSlug },
      };
    },
    {
      slugToParentSlugMap: {},
    }
  );

  const { parentSlugToSlugsMap } = Object.entries(slugToParentSlugMap).reduce(
    (acc, next) => {
      const { parentSlugToSlugsMap } = acc;
      const [childSlug, parentSlug] = next as [string, string];
      const children = parentSlugToSlugsMap[parentSlug];
      const nextChildren = children ? [...children, childSlug] : [childSlug];

      return {
        parentSlugToSlugsMap: {
          ...parentSlugToSlugsMap,
          [parentSlug]: nextChildren,
        },
      };
    },
    { parentSlugToSlugsMap: {} }
  );

  const parentSlugToPropertySubSlugsMap = propertyTypes.reduce((acc, next) => {
    const { slug, propertySubTypes } = next;
    const slugs = propertySubTypes.map(({ slug }) => slug);

    return {
      ...acc,
      [slug]: slugs,
    };
  }, {});

  return {
    slugToIdMap,
    idToSlugMap,
    slugToParentSlugMap,
    parentSlugToSlugsMap,
    parentSlugToPropertySubSlugsMap,
  };
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

  async slugForParentSlug({ slug }) {
    const { slugToParentSlugMap } = await fetchSlugIdMaps({
      redisProvider,
      propertyTypeService: this,
    });

    return slugToParentSlugMap[slug];
  },

  async parentSlugForSlugs({ slug }) {
    const { parentSlugToSlugsMap } = await fetchSlugIdMaps({
      redisProvider,
      propertyTypeService: this,
    });

    return parentSlugToSlugsMap[slug];
  },

  async parentSlugForPropertySubTypeSlugs({ slug }) {
    const { parentSlugToPropertySubSlugsMap } = await fetchSlugIdMaps({
      redisProvider,
      propertyTypeService: this,
    });

    return parentSlugToPropertySubSlugsMap[slug];
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

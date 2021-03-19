import { createMSSQLProvider } from '../../providers/mssql';
import { createApp, BASE_PATH } from './apps/property-type';
import {
  createPropertyTypeService,
  PropertyTypeService,
} from './services/property-type';
import { createRedisProvider } from '../../providers/redis';

type CreatePropertyTypeFeatureInput = {
  readonly mssqlURI: string;
  readonly redisURI: string;
};

export type PropertyTypeFeatureOptions = CreatePropertyTypeFeatureInput;

type PropertyTypeFeatureInputs = {
  readonly propertyTypeService: PropertyTypeService;
};

const propertyTypeFeature = ({
  propertyTypeService,
}: PropertyTypeFeatureInputs) => ({
  propertyTypeBasePath: BASE_PATH,

  propertyTypeApp() {
    return createApp({ propertyTypeService });
  },
});

export type PropertyTypeFeature = ReturnType<typeof propertyTypeFeature>;

export const createPropertyTypeFeature = async ({
  mssqlURI,
  redisURI
}: CreatePropertyTypeFeatureInput): Promise<PropertyTypeFeature> => {
  const mssqlProvider = await createMSSQLProvider({ uri: mssqlURI });
  const redisProvider = await createRedisProvider({ uri: redisURI });
  const propertyTypeService = await createPropertyTypeService({
    mssqlProvider,
    redisProvider
  });

  return propertyTypeFeature({ propertyTypeService });
};

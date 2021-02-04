import { createMSSQLProvider } from '../../providers/mssql';
import { createApp, BASE_PATH } from './apps/property-type';
import {
  createPropertyTypeService,
  PropertyTypeService,
} from './services/property-type';

type CreatePropertyTypeFeatureInput = {
  readonly mssqlURI: string;
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
}: CreatePropertyTypeFeatureInput): Promise<PropertyTypeFeature> => {
  const mssqlProvider = await createMSSQLProvider({ uri: mssqlURI });
  const propertyTypeService = await createPropertyTypeService({
    mssqlProvider,
  });
  return propertyTypeFeature({ propertyTypeService });
};

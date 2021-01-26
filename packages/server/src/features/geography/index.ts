import { createMSSQLProvider } from '../../providers/mssql';
import { createApp, BASE_PATH } from './apps/geography';
import { createGeographyService, GeographyService } from './services/geography';

type CreateGeographyFeatureInput = {
  readonly mssqlURI: string;
};

export type GeographyFeatureOptions = CreateGeographyFeatureInput;

type GeographyFeatureInputs = {
  readonly geographyService: GeographyService;
};

const geographyFeature = ({ geographyService }: GeographyFeatureInputs) => ({
  geographyBasePath: BASE_PATH,

  geographyApp() {
    return createApp({ geographyService });
  },
});

export type GeographyFeature = ReturnType<typeof geographyFeature>;

export const createGeographyFeature = async ({
  mssqlURI,
}: CreateGeographyFeatureInput): Promise<GeographyFeature> => {
  const mssqlProvider = await createMSSQLProvider({ uri: mssqlURI });
  const geographyService = await createGeographyService({ mssqlProvider });
  return geographyFeature({ geographyService });
};

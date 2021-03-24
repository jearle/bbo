import { BASE_PATH, createApp, DESCRIPTION } from './apps/lookups';
import { createCurrencyService, CurrencyService } from './services/currency';
import { createDataTypeService, DataTypeService } from './services/data-type';

type LookupsFeatureInputs = {
  readonly currencyService: CurrencyService;
  readonly dataTypeService: DataTypeService;
};

const lookupsFeature = ({
  currencyService,
  dataTypeService,
}: LookupsFeatureInputs) => ({
  lookupsBasePath: BASE_PATH,
  lookupsDescription: DESCRIPTION,

  lookupsApp: () => {
    return createApp({ currencyService, dataTypeService });
  },
});

type LookupsFeature = ReturnType<typeof lookupsFeature>;

export const createLookupsFeature = (): LookupsFeature => {
  const currencyService = createCurrencyService();
  const dataTypeService = createDataTypeService();

  return lookupsFeature({ currencyService, dataTypeService });
};

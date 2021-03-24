import { BASE_PATH, createApp, DESCRIPTION } from './apps/lookups';
import { createCurrencyService, CurrencyService } from './services/currency';
import { createDataTypeService, DataTypeService } from './services/data-type';
import {createRentableAreaService, RentableAreaService} from "./services/rentable-area";

type LookupsFeatureInputs = {
  readonly currencyService: CurrencyService;
  readonly rentableAreaService: RentableAreaService;
  readonly dataTypeService: DataTypeService;
};

const lookupsFeature = ({
  currencyService,
  rentableAreaService,
  dataTypeService,
}: LookupsFeatureInputs) => ({
  lookupsBasePath: BASE_PATH,
  lookupsDescription: DESCRIPTION,

  lookupsApp: () => {
    return createApp({ currencyService, rentableAreaService, dataTypeService });
  },
});

type LookupsFeature = ReturnType<typeof lookupsFeature>;

export const createLookupsFeature = (): LookupsFeature => {
  const currencyService = createCurrencyService();
  const rentableAreaService = createRentableAreaService();
  const dataTypeService = createDataTypeService();

  return lookupsFeature({ currencyService, rentableAreaService, dataTypeService });
};

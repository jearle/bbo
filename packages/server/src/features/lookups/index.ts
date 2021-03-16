import {BASE_PATH, createApp, DESCRIPTION} from "./apps/lookups";
import {createCurrencyService, CurrencyService} from "./services/currency";

type LookupsFeatureInputs = {
  readonly currencyService: CurrencyService;
}

const lookupsFeature = ({
  currencyService
}: LookupsFeatureInputs) => ({
  lookupsBasePath: BASE_PATH,
  lookupsDescription: DESCRIPTION,

  lookupsApp: () => {
    return createApp({ currencyService })
  }
});

type LookupsFeature = ReturnType<typeof lookupsFeature>;

export const createLookupsFeature = (): LookupsFeature => {
  const currencyService = createCurrencyService();

  return lookupsFeature({ currencyService });
}

import {currencies} from "shared/dist/helpers/types/currency";

const currencyService = () => ({
  getCurrencies: () => {
    return currencies;
  }
});
export type CurrencyService = ReturnType<typeof currencyService>;

export const createCurrencyService = (): CurrencyService => {
  return currencyService();
}

import { isValidCurrency } from "shared/dist/helpers/types/currency";

type AggregationInput = {
  aggregationType: string;
  currency?: string;
}

export const currencyValidator = ({ aggregationType, currency }: AggregationInput): Promise<boolean> => {
  switch(aggregationType?.toString().toUpperCase()) {
    case 'PRICE':
    case 'PPU':
    case 'PPSF':
    case 'PPSM':
      if (!currency) {
        return Promise.reject(`Must supply currency for aggregation type: ${aggregationType}`);
      }
      if (!isValidCurrency(currency)) {
        return Promise.reject(`Currency: ${currency} is not supported`)
      }
      return Promise.resolve(true);
    default:
      return Promise.resolve(true)
  }
}

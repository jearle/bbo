import { isValidCurrency } from "shared/dist/helpers/types/currency";
import { isValidRentableArea } from "shared/dist/helpers/types/rentable-area";

type AggregationInput = {
  aggregationType: string;
  currency?: string;
  rentableArea?: string;
}

export const currencyValidator = ({ aggregationType, currency }: AggregationInput): Promise<boolean> => {
  switch(aggregationType?.toString().toUpperCase()) {
    case 'PRICE':
    case 'PPU':
    case 'PPA':
      if (!currency) {
        return Promise.reject(`Must supply currency for aggregation type: ${aggregationType}`);
      }
      if (!isValidCurrency(currency)) {
        return Promise.reject(`currency: ${currency} is not supported`)
      }
      return Promise.resolve(true);
    default:
      return Promise.resolve(true)
  }
}

export const rentableAreaValidator = ({ aggregationType, rentableArea }: AggregationInput): Promise<boolean> => {
  switch(aggregationType?.toString().toUpperCase()) {
    case 'AREA':
    case 'PPA':
      if (!rentableArea) {
        return Promise.reject(`Must supply rentableArea for aggregation type: ${aggregationType}`);
      }
      if (!isValidRentableArea(rentableArea)) {
        return Promise.reject(`rentableArea: ${rentableArea} is not supported`)
      }
      return Promise.resolve(true);
    default:
      return Promise.resolve(true)
  }
}

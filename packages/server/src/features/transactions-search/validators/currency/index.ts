import { isValidCurrency } from 'shared/dist/helpers/types/currency';

type AggregationInput = {
  readonly aggregationType: string;
  readonly currency?: string;
};

const CURRENCY_REQUIRED_AGGREGATION_TYPES = [`PRICE`, `PPU`, `PPA`];

const missingCurrencyError = (aggregationType: string): string => {
  return `Must supply currency for aggregation type: ${aggregationType}`;
};

const unsupportedCurrencyError = (currency: string): string => {
  return `Currency: ${currency} is not supported`;
};

export const currencyValidator = ({
  aggregationType,
  currency,
}: AggregationInput): Promise<boolean> => {
  const hasCurrencyRequirement = CURRENCY_REQUIRED_AGGREGATION_TYPES.includes(
    aggregationType?.toString().toUpperCase()
  );

  if (!hasCurrencyRequirement) return Promise.resolve(true);

  if (!currency) return Promise.reject(missingCurrencyError(aggregationType));

  if (!isValidCurrency(currency))
    return Promise.reject(unsupportedCurrencyError(currency));

  return Promise.resolve(true);
};

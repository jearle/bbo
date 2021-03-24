import { Currency } from './currency';
import { RentableArea } from './rentable-area';

export type Aggregation = {
  aggregationType: AggregationType;
  currency?: Currency;
  rentableArea?: RentableArea;
};

export type AggregationType =
  | 'PRICE'
  | 'PROPERTY'
  | 'UNITS'
  | 'AREA'
  | 'CAPRATE'
  | 'PPU'
  | 'PPA';

export const calculatedAverageAggregations: AggregationType[] = [
  'PPU',
  'PPA',
];

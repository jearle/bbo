import { Currency } from './currency';
import { RentableArea } from './rentable-area';

export type Aggregation = {
  aggregationType: AggregationType;
  currency?: Currency;
  rentableArea?: RentableArea;
};

// TODO: Rename SQFT to AREA ?
export type AggregationType =
  | 'PRICE'
  | 'PROPERTY'
  | 'UNITS'
  | 'SQFT'
  | 'CAPRATE'
  | 'PPU'
  | 'PPSF';

export const calculatedAverageAggregations: AggregationType[] = [
  'PPU',
  'PPSF',
];

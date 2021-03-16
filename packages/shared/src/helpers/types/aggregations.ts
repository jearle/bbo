import {Currency} from "./currency";

export type Aggregation = {
  aggregationType: AggregationType;
  currency?: Currency;
};

export type AggregationType = 'PRICE' | 'PROPERTY' | 'UNITS' | 'SQFT'| 'CAPRATE' | 'PPU' | 'PPSF' | 'PPSM';

export const calculatedAverageAggregations: AggregationType[] = ['PPU', 'PPSF', 'PPSM'];

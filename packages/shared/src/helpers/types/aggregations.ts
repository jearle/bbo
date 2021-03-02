export type Aggregation = {
  aggregationType: AggregationType;
  currency?: Currency;
};

export type AggregationType = 'PRICE' | 'PROPERTY' | 'UNITS' | 'SQFT' | 'PPU' | 'PPSF' | 'PPSM';
export type Currency = 'USD' | 'EUR' | null;

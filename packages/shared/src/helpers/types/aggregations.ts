export type Aggregation = {
  aggregationType: AggregationType;
  currency?: Currency;
};

export type AggregationType = 'PRICE' | 'PROPERTY' | 'UNITS' | 'SQFT' | 'PPU';
export type Currency = 'USD' | 'EUR' | null;

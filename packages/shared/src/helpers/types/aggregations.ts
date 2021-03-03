export type Aggregation = {
  aggregationType: AggregationType;
  currency?: Currency;
};

export type AggregationType = 'PRICE' | 'PROPERTY' | 'UNITS' | 'SQFT'| 'CAPRATE';
export type Currency = 'USD' | 'EUR' | null;

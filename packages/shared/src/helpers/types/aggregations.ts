
export type Aggregation = {
  aggregationType: AggregationType,
  currency?: Currency
}

export type AggregationType = 'price' | 'property'
export type Currency = 'USD' | 'EUR'| null

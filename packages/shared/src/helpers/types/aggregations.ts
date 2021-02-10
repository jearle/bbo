
export type Aggregation = {
  aggregationType: AggregationType,
  currency?: Currency
}

export type AggregationType = 'price' | 'property'| 'units'| 'sqft'
export type Currency = 'USD' | 'EUR'| null
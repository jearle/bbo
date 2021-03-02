import * as Geography from '../../../types/geography';
import { createGeographyFilterTerms } from '../geography-filters';
import { createSumAggs } from './sum-aggregation-builder';

describe('sum aggregation builder', () => {
  const bool = {
    bool: {
      should: [
        {
          bool: {
            must: [
              {
                range: {
                  dealStatusPriceUSD_amt: {
                    gte: 2500000,
                  },
                },
              },
            ],
          },
        },
      ],
    },
  };

  it('create quarterly (sum) aggregation for price (CRE volume) in default currency USD', () => {
    const expected = {
      sumPerQuarter: {
        date_histogram: {
          field: 'status_dt',
          calendar_interval: 'quarter',
          format: 'YYYY-MM-dd',
          min_doc_count: 0,
        },
        aggs: {
          filteredSum: {
            filter: {
              bool: {
                must: [
                  {
                    term: {
                      eligibleForStats_fg: true,
                    },
                  },
                  {
                    term: {
                      eligibleTTVolume_fg: true,
                    },
                  },
                  bool,
                ],
              },
            },
            aggs: {
              sumResult: {
                sum: {
                  field: 'statusPriceAdjusted_amt.usd',
                },
              },
            },
          },
        },
      },
    };
    const result = createSumAggs({ aggregationType: 'PRICE' });
    expect(result).toEqual(expected);
  });

  it('create quarterly (sum) aggregation for number of properties', () => {
    const expected = {
      sumPerQuarter: {
        date_histogram: {
          field: 'status_dt',
          calendar_interval: 'quarter',
          format: 'YYYY-MM-dd',
          min_doc_count: 0,
        },
        aggs: {
          filteredSum: {
            filter: {
              bool: {
                must: [
                  {
                    term: {
                      eligibleForStats_fg: true,
                    },
                  },
                  {
                    term: {
                      eligibleTTVolume_fg: true,
                    },
                  },
                  bool,
                ],
              },
            },
            aggs: {
              sumResult: {
                sum: {
                  field: 'numberOfProperties_nb',
                },
              },
            },
          },
        },
      },
    };
    const result = createSumAggs({ aggregationType: 'PROPERTY' });
    expect(result).toEqual(expected);
  });

  it('create quarterly (sum) aggregation for number of units', () => {
    const expected = {
      sumPerQuarter: {
        date_histogram: {
          field: 'status_dt',
          calendar_interval: 'quarter',
          format: 'YYYY-MM-dd',
          min_doc_count: 0,
        },
        aggs: {
          filteredSum: {
            filter: {
              bool: {
                must: [
                  {
                    term: {
                      eligibleForStats_fg: true,
                    },
                  },
                  {
                    term: {
                      eligibleTTVolume_fg: true,
                    },
                  },
                  bool,
                ],
              },
            },
            aggs: {
              sumResult: {
                sum: {
                  field: 'units_dbl',
                },
              },
            },
          },
        },
      },
    };
    const result = createSumAggs({ aggregationType: 'UNITS' });
    expect(result).toEqual(expected);
  });

  it('create quarterly (sum) aggregation for number of units', () => {
    const expected = {
      sumPerQuarter: {
        date_histogram: {
          field: 'status_dt',
          calendar_interval: 'quarter',
          format: 'YYYY-MM-dd',
          min_doc_count: 0,
        },
        aggs: {
          filteredSum: {
            filter: {
              bool: {
                must: [
                  {
                    term: {
                      eligibleForStats_fg: true,
                    },
                  },
                  {
                    term: {
                      eligibleTTVolume_fg: true,
                    },
                  },
                  bool,
                ],
              },
            },
            aggs: {
              sumResult: {
                sum: {
                  field: 'sqFt_dbl',
                },
              },
            },
          },
        },
      },
    };
    const result = createSumAggs({ aggregationType: 'SQFT' });
    expect(result).toEqual(expected);
  });

  it('aggregationType error', () => {
    try {
      createSumAggs({ aggregationType: 'random' } as any);
    } catch (e) {
      expect(e).toEqual('field does not exist for aggregation');
    }
  });

  it('currencyType error', () => {
    try {
      createSumAggs({ aggregationType: 'price', currency: 'Bitcoin' } as any);
    } catch (e) {
      expect(e).toEqual('field does not exist for aggregation');
    }
  });
});

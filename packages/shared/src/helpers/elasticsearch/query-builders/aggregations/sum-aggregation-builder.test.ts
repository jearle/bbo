import * as Geography from '../../../types/geography';
import { createGeographyFilterTerms } from '../geography-filters';
import { createAggs } from './sum-aggregation-builder';

describe('sum aggregation builder', () => {
  it('create quarterly (sum) aggregation for price (CRE volume) in default currency USD', () => {

    const bool = {
      bool: {
      should: [
        {
          bool: {
            must: [
              {
                range: {
                  dealStatusPriceUSD_amt: {
                    gte: 10000000
                  }
                }
              }
            ]
          }
        },
        {
          bool: {
            must: [
              {
                range: {
                  dealStatusPriceUSD_amt: {
                    gte: 2500000
                  }
                }
              }
            ]
          }
        }
      ]
    }};


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
                      eligibleTTVolume_fg: true,
                    },
                  },
                  bool,
                ],
              }
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
    const result = createAggs({ aggregationType: 'PRICE' });
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
                      eligibleTTVolume_fg: true,
                    },
                  },
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
    const result = createAggs({ aggregationType: 'PROPERTY' });
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
                      eligibleTTVolume_fg: true,
                    },
                  },
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
    const result = createAggs({ aggregationType: 'UNITS' });
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
                      eligibleTTVolume_fg: true,
                    },
                  },
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
    const result = createAggs({ aggregationType: 'SQFT' });
    expect(result).toEqual(expected);
  });

  it('aggregationType error', () => {
    try {
      createAggs({ aggregationType: 'random' } as any);
    } catch (e) {
      expect(e).toEqual('field does not exist for aggregation');
    }
  });

  it('currencyType error', () => {
    try {
      createAggs({ aggregationType: 'price', currency: 'Bitcoin' } as any);
    } catch (e) {
      expect(e).toEqual('field does not exist for aggregation');
    }
  });
});

import { createAggs } from './sum-aggregation-builder';
import { quarters } from '../date-builder';

describe('sum aggregation builder', () => {
  const bool = { range: { dealStatusPriceUSD_amt: { gte: 2500000 } }};

  it('create quarterly (sum) aggregation for price (CRE volume) in default currency USD', () => {
    const expected = {
      sumPerQuarter: {
        range: {
          field: "status_dt",
          ranges: quarters
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
    const result = createAggs({ aggregationType: 'PRICE' });
    expect(result).toEqual(expected);
  });

  it('create quarterly (sum) aggregation for number of properties', () => {
    const expected = {
      sumPerQuarter: {
        range: {
          field: "status_dt",
          ranges: quarters
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
    const result = createAggs({ aggregationType: 'PROPERTY' });
    expect(result).toEqual(expected);
  });

  it('create quarterly (sum) aggregation for number of units', () => {
    const expected = {
      sumPerQuarter: {
        range: {
          field: "status_dt",
          ranges: quarters
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
    const result = createAggs({ aggregationType: 'UNITS' });
    expect(result).toEqual(expected);
  });

  it('create quarterly (sum) aggregation for number of units', () => {
    const expected = {
      sumPerQuarter: {
        range: {
          field: "status_dt",
          ranges: quarters
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
    const result = createAggs({ aggregationType: 'SQFT' });
    expect(result).toEqual(expected);
  });

  it('create quarterly (avg) aggregation for capRate', () => {

    const filter = {
      bool: {
        must: [
          {
            term: {
              eligibleForCapRates_fg: true,
            },
          },
          {
            term: {
              eligibleForStats_fg: true,
            },
          },
          {
            terms: {
              transType_id: [1, 2, 3],
            },
          },
          {
            term: {
              status_id: 1,
            },
          },
          bool,
        ],
      },
    };

    const expected = {
      sumPerQuarter: {
        range: {
          field: "status_dt",
          ranges: quarters
        },
        aggs: {
          filteredSum: {
            filter,
            aggs: {
              sumResult: {
                avg: {
                  field: 'statusCapRate_dbl',
                },
              },
            },
          },
        }
      },
    };
    const result = createAggs({ aggregationType: 'CAPRATE' });
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

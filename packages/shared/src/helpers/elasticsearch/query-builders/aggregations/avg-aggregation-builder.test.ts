import {createAvgAggs} from "./avg-aggregation-builder";

describe('average aggregation builder', () => {
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

  it('create quarterly (avg) aggregation for price per unit (PPU) in default currency USD', () => {
    const expected = {
      avgPerQuarter: {
        date_histogram: {
          field: 'status_dt',
          calendar_interval: 'quarter',
          format: 'YYYY-MM-dd',
          min_doc_count: 0,
        },
        aggs: {
          calculatedAverage: {
            bucket_script: {
              buckets_path: {
                num: 'filteredSum_0>sumResult',
                div: 'filteredSum_1>sumResult'
              },
              script: `params.num / (params.div * 1)`
            }
          },
          filteredSum_0: {
            filter: {
              bool: {
                must: [
                  {
                    term: {
                      eligibleTTPPU_fg: true,
                    },
                  },
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
                  field: 'statusPrice_amt.usd',
                },
              },
            },
          },
          filteredSum_1: {
            filter: {
              bool: {
                must: [
                  {
                    term: {
                      eligibleTTPPU_fg: true,
                    },
                  },
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
    const result = createAvgAggs({ aggregationType: 'PPU' });
    expect(result).toEqual(expected);
  });

  it('create quarterly (avg) aggregation for price per square foot (PPSF) in default currency USD', () => {
    const expected = {
      avgPerQuarter: {
        date_histogram: {
          field: 'status_dt',
          calendar_interval: 'quarter',
          format: 'YYYY-MM-dd',
          min_doc_count: 0,
        },
        aggs: {
          calculatedAverage: {
            bucket_script: {
              buckets_path: {
                num: 'filteredSum_0>sumResult',
                div: 'filteredSum_1>sumResult'
              },
              script: `params.num / (params.div * 1)`
            }
          },
          filteredSum_0: {
            filter: {
              bool: {
                must: [
                  {
                    term: {
                      eligibleTTPPU_fg: true,
                    },
                  },
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
                  field: 'statusPrice_amt.usd',
                },
              },
            },
          },
          filteredSum_1: {
            filter: {
              bool: {
                must: [
                  {
                    term: {
                      eligibleTTPPU_fg: true,
                    },
                  },
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
    const result = createAvgAggs({ aggregationType: 'PPSF' });
    expect(result).toEqual(expected);
  });

  it('create quarterly (avg) aggregation for price per square meter (PPSM) in default currency USD', () => {
    const expected = {
      avgPerQuarter: {
        date_histogram: {
          field: 'status_dt',
          calendar_interval: 'quarter',
          format: 'YYYY-MM-dd',
          min_doc_count: 0,
        },
        aggs: {
          calculatedAverage: {
            bucket_script: {
              buckets_path: {
                num: 'filteredSum_0>sumResult',
                div: 'filteredSum_1>sumResult'
              },
              script: `params.num / (params.div * 0.0929)`
            }
          },
          filteredSum_0: {
            filter: {
              bool: {
                must: [
                  {
                    term: {
                      eligibleTTPPU_fg: true,
                    },
                  },
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
                  field: 'statusPrice_amt.usd',
                },
              },
            },
          },
          filteredSum_1: {
            filter: {
              bool: {
                must: [
                  {
                    term: {
                      eligibleTTPPU_fg: true,
                    },
                  },
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
    const result = createAvgAggs({ aggregationType: 'PPSM' });
    expect(result).toEqual(expected);
  });

});

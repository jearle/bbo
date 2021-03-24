import {createAggs, createCalculatedAverageAggs} from './sum-aggregation-builder';

describe('sum aggregation builder', () => {
  describe ('createAggs()', () => {
    const bool = { range: { dealStatusPriceUSD_amt: { gte: 2500000 } }};

    it('create (sum) aggregation for price (CRE volume) in default currency USD', () => {
      const expected = {
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
      }
      const result = createAggs({ aggregationType: 'PRICE', currency: 'USD' });
      expect(result).toEqual(expected);
    });

    it('create (sum) aggregation for number of properties', () => {
      const expected = {
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
      }
      const result = createAggs({ aggregationType: 'PROPERTY' });
      expect(result).toEqual(expected);
    });

    it('create (sum) aggregation for number of units', () => {
      const expected = {
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
      }
      const result = createAggs({ aggregationType: 'UNITS' });
      expect(result).toEqual(expected);
    });

    it('create (sum) aggregation for SQFT, SQFT', () => {
      const expected = {
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
                field: 'sqFt_dbl'
              },
            },
          },
        },
      }
      const result = createAggs({ aggregationType: 'SQFT', rentableArea: 'SQFT' });
      expect(result).toEqual(expected);
    });

    it('create (sum) aggregation for SQFT, SQMT', () => {
      const expected = {
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
                script: {
                  source: '_value * 0.092903'
                }
              },
            },
          },
        },
      }
      const result = createAggs({ aggregationType: 'SQFT', rentableArea: 'SQMT' });
      expect(result).toEqual(expected);
    });

    it('create (avg) aggregation for capRate', () => {

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
      const result = createAggs({ aggregationType: 'CAPRATE' });
      expect(result).toEqual(expected);
    });
  });
  describe('createCalculatedAverageAggs()', () => {
    it('creates calculated aggregation for ppu', () => {
      const filter = {
        bool: {
          must: [
            {
              term: {
                eligibleForStats_fg: true
              }
            },
            {
              term: {
                eligibleTTVolume_fg: true
              }
            },
            {
              term: {
                eligibleTTPPU_fg: true
              }
            },
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

      const expected = {
        calculatedAverage: {
          bucket_script: {
            buckets_path: {
              num: 'numSum>sumResult',
              div: 'divSum>sumResult'
            },
            script: `params.num / params.div`
          }
        },
        numSum: {
          filter,
          aggs: {
            sumResult: {
              sum: {
                field: 'statusPrice_amt.usd'
              }
            }
          }
        },
        divSum: {
          filter,
          aggs: {
            sumResult: {
              sum: {
                field: 'units_dbl'
              }
            }
          }
        }
      }

      const result = createCalculatedAverageAggs({aggregationType: 'PPU', currency: 'USD'});
      expect(result).toEqual(expected);
    });

    it('creates calculated aggregation for ppsf', () => {
      const filter = {
        bool: {
          must: [
            {
              term: {
                eligibleForStats_fg: true
              }
            },
            {
              term: {
                eligibleTTVolume_fg: true
              }
            },
            {
              term: {
                eligibleTTPPU_fg: true
              }
            },
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

      const expected = {
        calculatedAverage: {
          bucket_script: {
            buckets_path: {
              num: 'numSum>sumResult',
              div: 'divSum>sumResult'
            },
            script: `params.num / params.div`
          }
        },
        numSum: {
          filter,
          aggs: {
            sumResult: {
              sum: {
                field: 'statusPrice_amt.usd'
              }
            }
          }
        },
        divSum: {
          filter,
          aggs: {
            sumResult: {
              sum: {
                field: 'sqFt_dbl'
              }
            }
          }
        }
      }

      const result = createCalculatedAverageAggs({aggregationType: 'PPSF', currency: 'USD', rentableArea: 'SQFT'});
      expect(result).toEqual(expected);
    });

    it('creates calculated aggregation for PPSF, SQMT', () => {
      const filter = {
        bool: {
          must: [
            {
              term: {
                eligibleForStats_fg: true
              }
            },
            {
              term: {
                eligibleTTVolume_fg: true
              }
            },
            {
              term: {
                eligibleTTPPU_fg: true
              }
            },
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

      const expected = {
        calculatedAverage: {
          bucket_script: {
            buckets_path: {
              num: 'numSum>sumResult',
              div: 'divSum>sumResult'
            },
            script: `params.num / params.div`
          }
        },
        numSum: {
          filter,
          aggs: {
            sumResult: {
              sum: {
                field: 'statusPrice_amt.usd'
              }
            }
          }
        },
        divSum: {
          filter,
          aggs: {
            sumResult: {
              sum: {
                field: 'sqFt_dbl',
                script: {
                  source: '_value * 0.092903'
                }
              }
            }
          }
        }
      }

      const result = createCalculatedAverageAggs({aggregationType: 'PPSF', currency: 'USD', rentableArea: 'SQMT'});
      expect(result).toEqual(expected);
    });
  });
  describe('error handling', () => {
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
  })
});

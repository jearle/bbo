import { createTrendSearchQuery } from './index';
import {
  Aggregation,
  Geography,
  PropertyType,
} from 'shared/dist/helpers/types';
import { quarters } from 'shared/dist/helpers/elasticsearch/query-builders/date-builder';

describe('trends-search', () => {
  const atlantaFilter: Geography.Filter = {
    id: 21,
    type: Geography.Types.Metro,
    name: 'Atlanta',
  };

  const officeFilter: PropertyType.Filter = {
    propertyTypeId: 96,
    allPropertySubTypes: true,
    propertySubTypeIds: [102, 107],
  };

  const aggregation: Aggregation = {
    aggregationType: 'PRICE',
    currency: 'USD',
  };

  it('creates a query with a permissions, geography, and property type filter', () => {
    const esQuery = createTrendSearchQuery({
      geographyFilter: atlantaFilter,
      propertyTypeFilter: officeFilter,
      permissionsFilter: {
        bool: {
          should: [
            {
              "bool": {
                "must": [
                  {
                    "terms": {
                      "propertyTypeSearch_id": [
                        5
                      ]
                    }
                  }
                ]
              }
            }
          ]
        }
      }
    });
    expect(esQuery.size).toEqual(0);
    expect(esQuery.query.bool.filter.bool.must.length).toBe(3);
    expect(esQuery.query.bool.filter.bool.must[0]).toEqual({
      terms: {
        newMetro_id: [21],
      },
    });
    expect(esQuery.query.bool.filter.bool.must[1]).toEqual({
      terms: {
        propertyTypeSearch_id: [96],
      },
    });
  });

  it('creates a sum aggregation query with filters and an aggregation', () => {
    const bool = { range: { dealStatusPriceUSD_amt: { gte: 2500000 } }};

    const esQuery = createTrendSearchQuery({
      geographyFilter: atlantaFilter,
      propertyTypeFilter: officeFilter,
      permissionsFilter: null,
      aggregation,
    });
    expect(esQuery.aggs).toEqual({
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
    });
  });

  it('creates a calculated average query with filters for calculated average aggregations', () => {
    const esQuery = createTrendSearchQuery({
      geographyFilter: atlantaFilter,
      propertyTypeFilter: officeFilter,
      permissionsFilter: null,
      aggregation: {
        aggregationType: 'PPU',
        currency: 'USD',
      },
    });
    expect(esQuery.aggs).toEqual({
      avgPerQuarter: {
        range: {
          field: "status_dt",
          ranges: quarters
        },
        aggs: {
          calculatedAverage: {
            bucket_script: {
              buckets_path: {
                num: 'numSum>sumResult',
                div: 'divSum>sumResult'
              },
              script: 'params.num / params.div'
            }
          },
          numSum: {
            filter: {
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
            },
            aggs: {
              sumResult: {
                sum: {
                  field: 'statusPrice_amt.usd'
                }
              }
            }
          },
          divSum: {
        filter: {
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
        },
        aggs: {
          sumResult: {
            sum: {
              field: 'units_dbl'
            }
          }
        }
      }
        }
      }
    });

  })
});

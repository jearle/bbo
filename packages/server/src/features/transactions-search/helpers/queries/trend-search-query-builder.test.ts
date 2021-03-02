import { createTrendSearchQuery } from './index';
import {
  Aggregation,
  Geography,
  PropertyType,
} from 'shared/dist/helpers/types';

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

  it('creates a query with filters and an aggregation', () => {
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

    const esQuery = createTrendSearchQuery({
      geographyFilter: atlantaFilter,
      propertyTypeFilter: officeFilter,
      permissionsFilter: null,
      aggregation,
    });
    expect(esQuery.aggs).toEqual({
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
    });
  });
});

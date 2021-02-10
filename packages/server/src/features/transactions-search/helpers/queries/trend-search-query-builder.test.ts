import { createTrendSearchQuery } from './index';
import { Aggregation, Filter, Types } from 'shared/dist/helpers/types';

describe('trends-search', () => {
  const atlantaFilter: Filter = {
    id: 21,
    type: Types.Metro,
    name: 'Atlanta',
  };

  const aggregation: Aggregation = {
    aggregationType: 'price',
    currency: 'USD',
  };

  it('creates a query with a geography filter', () => {
    const esQuery = createTrendSearchQuery({ geographyFilter: atlantaFilter });
    expect(esQuery.size).toEqual(0);
    expect(esQuery.query.bool.filter.bool.must.length).toBe(1);
    expect(esQuery.query.bool.filter.bool.must[0]).toEqual({
      terms: {
        newMetro_id: [21],
      },
    });
  });

  it('creates a query with a geography filter and an aggregation', () => {
    const esQuery = createTrendSearchQuery({
      geographyFilter: atlantaFilter,
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
                      eligibleTTVolume_fg: true,
                    },
                  },
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

import { Aggregation } from '../../../types/aggregations';
import { Filter } from '../../../types/geography';
import { ElasticQuery } from '../../../types/elasticsearch';
import { createGeographyFilterTerms } from '../geography-filters';
import { createAggs } from '../aggregations';


type TrendsSearchQueryInputs = {
  readonly limit?: number;
  readonly geographyFilter: Filter;
  readonly aggregation?: Aggregation;
};

export const createTrendSearchQuery = ({
                                    geographyFilter,
                                    limit = 0,
                                    aggregation,
                                  }: TrendsSearchQueryInputs): ElasticQuery => {
  const geographyMust = createGeographyFilterTerms([geographyFilter]);
  // const propertyTypeMust = createPropertyTypeFilterTerms();
  const mustArr = [...geographyMust];
  const query = {
    query: {
      bool: {
        must: {
          match_all: {},
        },
        filter: {
          bool: {
            must: mustArr,
          },
        },
      },
    },
    size: limit
  }
  if (aggregation?.aggregationType) {
    const aggs = createAggs(aggregation);
    const queryWithAggs = {
      query: query.query,
      aggs,
      size: 0,
    }
    return queryWithAggs;
  }
  return query;
};
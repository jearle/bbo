import { Filter as GeographyFilter } from 'shared/dist/helpers/types/geography';
import { createGeographyFilterTerms } from 'shared/dist/helpers/elasticsearch/query-builders/geography-filters';
import { ElasticQuery } from 'shared/dist/helpers/types/elasticsearch';
import { createAggs } from 'shared/dist/helpers/elasticsearch/query-builders/aggregations';
import { Aggregation } from 'shared/dist/helpers/types/aggregations';

type TrendsSearchQueryInputs = {
  readonly limit?: number;
  readonly GeographyFilter: GeographyFilter;
  readonly aggregation?: Aggregation;
};

export const trendsSearchQuery = ({
  GeographyFilter,
  limit = 0,
  aggregation,
}: TrendsSearchQueryInputs): ElasticQuery => {
  const geographyMust = createGeographyFilterTerms([GeographyFilter]);
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
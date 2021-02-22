import {
  Aggregation,
  Geography,
  PropertyType,
} from 'shared/dist/helpers/types';
import { createAggs } from 'shared/dist/helpers/elasticsearch/query-builders/aggregations';
import { createGeographyFilterTerms } from 'shared/dist/helpers/elasticsearch/query-builders/geography-filters';
import { createPropertyTypeFilterTerms } from 'shared/dist/helpers/elasticsearch/query-builders/property-type-filters';
import { ElasticQuery } from 'shared/dist/helpers/types/elasticsearch';
import { CreatePermissionsFilterResult } from '../../../permissions/helpers/elasticsearch/permissions-filter';

type TrendsSearchQueryInputs = {
  readonly limit?: number;
  readonly geographyFilter: Geography.Filter;
  readonly propertyTypeFilter: PropertyType.Filter;
  readonly aggregation?: Aggregation;
  readonly permissionsFilter: CreatePermissionsFilterResult;

};

export const createTrendSearchQuery = ({
  geographyFilter,
  propertyTypeFilter,
  permissionsFilter,
  limit = 0,
  aggregation,
}: TrendsSearchQueryInputs): ElasticQuery => {
  const geographyMust = createGeographyFilterTerms([geographyFilter]);
  const propertyTypeMust = createPropertyTypeFilterTerms([propertyTypeFilter]);
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mustArr: any = [...geographyMust, ...propertyTypeMust];
  if (permissionsFilter) {
    mustArr.push(permissionsFilter);
  }
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
    size: limit,
  };
  if (aggregation?.aggregationType) {
    const aggs = createAggs(aggregation);
    const queryWithAggs = {
      query: query.query,
      aggs,
      size: 0,
    };
    return queryWithAggs;
  }
  return query;
};

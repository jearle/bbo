import {
  Aggregation,
  Geography,
  PropertyType,
} from 'shared/dist/helpers/types';
import { createGeographyFilterTerms } from 'shared/dist/helpers/elasticsearch/query-builders/geography-filters';
import { createPropertyTypeFilterTerms } from 'shared/dist/helpers/elasticsearch/query-builders/property-type-filters';
import { ElasticQuery } from 'shared/dist/helpers/types/elasticsearch';
import { CreatePermissionsFilterResult } from '../../../permissions/helpers/elasticsearch/permissions-filter';
import { createAggs } from "shared/dist/helpers/elasticsearch/query-builders/aggregations";
import { createAvgAggs } from "shared/dist/helpers/elasticsearch/query-builders/aggregations";

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
  const mustArr: unknown[] = [...geographyMust, ...propertyTypeMust];
  permissionsFilter && mustArr.push(permissionsFilter);

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

// const createAggs = (aggregation: Aggregation) => {
//   switch(aggregation.aggregationType.toUpperCase()) {
//     case 'PRICE':
//     case 'PROPERTY':
//     case 'UNITS':
//     case 'SQFT':
//       return createAggs(aggregation);
//     case 'PPU':
//     case 'PPSF':
//     case 'PPSM':
//       return createAvgAggs(aggregation);
//     default:
//       throw `Cannot create aggregation query for unknown aggregation type ${aggregation.aggregationType}`;
//   }
// }

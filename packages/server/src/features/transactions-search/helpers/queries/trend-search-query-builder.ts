import {
  Aggregation,
  Geography,
  PropertyType,
  calculatedAverageAggregations, AggregationType
} from 'shared/dist/helpers/types';
import { createGeographyFilterTerms } from 'shared/dist/helpers/elasticsearch/query-builders/geography-filters';
import { createPropertyTypeFilterTerms } from 'shared/dist/helpers/elasticsearch/query-builders/property-type-filters';
import { ElasticQuery } from 'shared/dist/helpers/types/elasticsearch';
import { CreatePermissionsFilterResult } from '../../../permissions/helpers/elasticsearch/permissions-filter';
import {createAggs, createCalculatedAverageAggs} from "shared/dist/helpers/elasticsearch/query-builders/aggregations";
import {quarters} from "shared/dist/helpers/elasticsearch/query-builders/date-builder";

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
    let aggs;
    if (calculatedAverageAggregations.includes(aggregation?.aggregationType.toUpperCase() as AggregationType)) {
      aggs = {
        avgPerQuarter: {
          range: {
            field: "status_dt",
            ranges: quarters
          },
          aggs: createCalculatedAverageAggs(aggregation)
        }
      }

    } else {
      aggs = {
        sumPerQuarter: {
          range: {
            field: "status_dt",
            ranges: quarters
          },
          aggs: createAggs(aggregation)
        }
      }
    }
    return {
      query: query.query,
      aggs,
      size: 0,
    };
  }
  return query;
};

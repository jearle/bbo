import { Geography } from 'shared/src/helpers/elasticsearch/query-builders/constants';
import { createGeographyFilterTerms } from '../../../../../../shared/src/helpers/elasticsearch/query-builders/filter-builders/geography-filter-builder';

type TrendsSearchQueryInputs = {
  readonly GeographyFilter: Geography.Filter;
};

type TrendsSearchQuery = {
  query: any;
  size: number;
  aggs: any;
};

export const trendsSearchQuery = ({
  GeographyFilter
}: TrendsSearchQueryInputs): TrendsSearchQuery => {
  const geographyMust = createTrendsGeographyFilter(GeographyFilter);
  // const propertyTypeMust = createTrendsPropertyTypeFilter();
  const mustArr = [...geographyMust];
  // const aggs = createTrendsAggs(resultType) // something to specify if it's volume, # props, etc
  return {
    query: {
      bool: {
        must: {
          match_all: {}
        }
      },
      filter: {
        bool: {
          must: mustArr
        }
      }
    },
    size: 0,
    aggs: {}
  };
};

const createTrendsGeographyFilter = (geographyFilter: Geography.Filter) => {
  const geoPairs = createGeographyFilterPairs([geographyFilter]);
  return geoPairs.map((v, k) => {
    return { terms: { [k]: v } };
  });
};

// const createTrendsPropertyTypeFilter = ()...
// const createTrendsAggs ...

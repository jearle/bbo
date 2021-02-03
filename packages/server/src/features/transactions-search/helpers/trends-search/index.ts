import { Geography } from 'shared/dist/helpers/elasticsearch/constants';
import { createGeographyFilterTerms } from 'shared/dist/helpers/elasticsearch/query-builders/geography-filters';

type TrendsSearchQueryInputs = {
  readonly limit?: number;
  readonly GeographyFilter: Geography.Filter;
};

type TrendsSearchQuery = {
  query: {
    bool: {
      must: {
        match_all: {}
      };
      filter: {
        bool: {
          must: any[];
        };
      };
    };
  };
  size: number;
  // aggs: any;
};

export const trendsSearchQuery = ({
  GeographyFilter,
  limit = 0
}: TrendsSearchQueryInputs): TrendsSearchQuery => {

  const geographyMust = createGeographyFilterTerms([GeographyFilter]);
  // const propertyTypeMust = createPropertyTypeFilterTerms();
  const mustArr = [...geographyMust];
  // const aggs = createAggs(resultType) // something to specify if it's volume, # props, etc
  return {
    query: {
      bool: {
        must: {
          match_all: {}
        },
        filter: {
          bool: {
            must: mustArr
          }
        }
      }
    },
    size: limit
  };
};


export const trendsSearchResults = ({

}) => {
  // parse aggs
};

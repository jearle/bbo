import { Filter as GeographyFilter } from 'shared/dist/helpers/types/geography';
import { createGeographyFilterTerms } from 'shared/dist/helpers/elasticsearch/query-builders/geography-filters';
import { ElasticQuery } from 'shared/dist/helpers/types/elasticsearch';

type TrendsSearchQueryInputs = {
  readonly limit?: number;
  readonly GeographyFilter: GeographyFilter;
};

export const trendsSearchQuery = ({
  GeographyFilter,
  limit = 0,
}: TrendsSearchQueryInputs): ElasticQuery => {
  const geographyMust = createGeographyFilterTerms([GeographyFilter]);
  // const propertyTypeMust = createPropertyTypeFilterTerms();
  const mustArr = [...geographyMust];
  // const aggs = createAggs(resultType) // something to specify if it's volume, # props, etc
  return {
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
};

// export const trendsSearchResults = ({

// }) => {
//   // parse aggs
// };

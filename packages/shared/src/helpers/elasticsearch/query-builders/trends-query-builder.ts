import { map } from 'lodash';

import { createGeographyFilterTerms } from "./geography-filter-builder";

export const createTrendsGeographyMustFilter = (request: any) => {
  const mustGeoMap = createGeographyFilterTerms([request.GeographyFilter]);
  return map(mustGeoMap, (v, k) => {
    return { terms: { [k]: v } };
  });
};

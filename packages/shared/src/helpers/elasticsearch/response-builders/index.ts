import { EsClientRawResponse } from '../../types/elasticsearch';
import {AggregationType} from "../../types";

export const getElasticHits = (response: EsClientRawResponse): unknown[] => {
  const { hits } = response.body.hits;
  return hits.map(({ _source }) => {
    return _source;
  });
};
/*

export const getElasticBody = (response: EsClientRawResponse) => {
  return response.body;
};

*/

export const getElasticBucket = (response: EsClientRawResponse, aggregationType: AggregationType) => {
  if (['PPU', 'PPSF', 'PPSM'].includes(aggregationType)) {
    return getAvgElasticBucket(response);
  }
  return response.body.aggregations?.sumPerQuarter?.buckets?.map(
    (bucket) => {
      return {
        date: bucket.key_as_string,
        value: bucket.filteredSum.sumResult.value,
      };
    }
  );
};

export const getAvgElasticBucket = (response: EsClientRawResponse) => {
  return response.body.aggregations?.avgPerQuarter?.buckets?.map(
    (bucket) => {
      return {
        date: bucket.key_as_string,
        value: bucket.calculatedAverage?.value,
      };
    }
  );
};

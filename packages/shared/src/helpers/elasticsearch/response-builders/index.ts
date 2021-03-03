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
  if (['PPU', 'PPSF', 'PPSM'].includes(aggregationType.toUpperCase())) {
    return getAvgElasticBucket(response);
  }
  const buckets = response.body.aggregations?.sumPerQuarter?.buckets;
  const filteredBuckets = buckets?.filter((bucket) => (bucket.filteredSum["doc_count"] > 0));
  return filteredBuckets?.map(
    (bucket) => {
      if (bucket.filteredSum["doc_count"] > 0) {
        const dateStringYYYYMMDD = bucket.to_as_string.substring(0,10);
        return {
          date: dateStringYYYYMMDD,
          value: bucket.filteredSum.sumResult.value,
        };
      }
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

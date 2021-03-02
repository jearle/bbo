import { EsClientRawResponse } from '../../types/elasticsearch';

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

export const getElasticBucket = (response: EsClientRawResponse) => {
  const buckets = response.body.aggregations?.sumPerQuarter?.buckets;
  const filteredBuckets = buckets?.filter((bucket) => (bucket.filteredSum["doc_count"] > 0));
  const data = filteredBuckets?.map(
    (bucket) => {
      if (bucket.filteredSum["doc_count"] > 0) {
        return {
          date: bucket.to_as_string,
          value: bucket.filteredSum.sumResult.value,
        };
      }
    }
  );
  return data;
};

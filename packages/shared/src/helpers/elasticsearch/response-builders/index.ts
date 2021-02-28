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
  const data = response.body.aggregations?.sumPerQuarter?.buckets?.map(
    (bucket) => {
      return {
        date: bucket.key_as_string,
        value: bucket.filteredSum.sumResult.value,
      };
    }
  );
  return data;
};

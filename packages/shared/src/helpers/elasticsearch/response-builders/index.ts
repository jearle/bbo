import { EsClientRawResponse } from '../../types/elasticsearch';
import {AggregationType, calculatedAverageAggregations} from "../../types";

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

export const getTrendsDataFromElasticResponse = (response: EsClientRawResponse, aggregationType: AggregationType) => {
  if (calculatedAverageAggregations.includes(aggregationType.toUpperCase() as AggregationType)) {
    return getDataFromElasticBucket(response, 'avgPerQuarter', 'calculatedAverage');
  }
  return getDataFromElasticBucket(response, 'sumPerQuarter', 'filteredSum');
}

const getDataFromElasticBucket = (response: EsClientRawResponse, bucketKey: string, valueKey: string) => {

  return response.body.aggregations[bucketKey]?.buckets.map(
    (bucket) => {
      const dateStringYYYYMMDD = bucket.to_as_string.substring(0,10);
      return {
        date: dateStringYYYYMMDD,
        value: bucket[valueKey].sumResult.value,
      };
    }
  );
};

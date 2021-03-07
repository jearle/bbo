import { EsClientRawResponse } from '../../types/elasticsearch';
import {AggregationType, calculatedAverageAggregations} from "../../types";


type BucketValueGetter = (data) => number;

export const getElasticHits = (response: EsClientRawResponse): unknown[] => {
  const { hits } = response.body.hits;
  return hits.map(({ _source }) => {
    return _source;
  });
};

export const getTrendsDataFromElasticResponse = (response: EsClientRawResponse, aggregationType: AggregationType) => {
  if (calculatedAverageAggregations.includes(aggregationType.toUpperCase() as AggregationType)) {
    return getDataFromElasticBucket(response, 'avgPerQuarter', getValueFromCalculatedAverage);
  }
  return getDataFromElasticBucket(response, 'sumPerQuarter', getValueFromFilteredSum);
}

const getDataFromElasticBucket = (
  response: EsClientRawResponse,
  bucketKey: string,
  bucketValueGetter: BucketValueGetter) => {
  return response.body.aggregations[bucketKey]?.buckets.map(
    (bucket) => {
      const dateStringYYYYMMDD = bucket.to_as_string.substring(0,10);
      return {
        date: dateStringYYYYMMDD,
        value: bucketValueGetter(bucket)
      };
    }
  );
};

const getValueFromFilteredSum = data => data.filteredSum.sumResult.value;

const getValueFromCalculatedAverage = data => data.calculatedAverage.value;

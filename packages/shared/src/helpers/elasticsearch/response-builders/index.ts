import { EsClientRawResponse } from '../../types/elasticsearch';
import {AggregationType, calculatedAverageAggregations} from "../../types";


type BucketValueGetter = (data, minObservability?: number) => number;

export const getElasticHits = (response: EsClientRawResponse): unknown[] => {
  const { hits } = response.body.hits;
  return hits.map(({ _source }) => {
    return _source;
  });
};

export const getTrendsDataFromElasticResponse = (response: EsClientRawResponse, aggregationType: AggregationType) => {
  const minObservability = isPricingMetric(aggregationType) ? 2 : 0;
  if (calculatedAverageAggregations.includes(aggregationType.toUpperCase() as AggregationType)) {
    return getDataFromElasticBucket(response, 'avgPerQuarter', getValueFromCalculatedAverage, minObservability);
  }
  return getDataFromElasticBucket(response, 'sumPerQuarter', getValueFromFilteredSum, minObservability);
}

const isPricingMetric = (aggregationType: AggregationType): boolean => {
  return ['PPU', 'PPSF', 'PPSM', 'CAPRATE'].includes(aggregationType);
}

const getDataFromElasticBucket = (
  response: EsClientRawResponse,
  bucketKey: string,
  bucketValueGetter: BucketValueGetter,
  minObservability: number = 0) => {
  return response.body.aggregations[bucketKey]?.buckets.map(
    (bucket) => {
      const dateStringYYYYMMDD = bucket.to_as_string.substring(0,10);
      return {
        date: dateStringYYYYMMDD,
        value: bucketValueGetter(bucket, minObservability)
      };
    }
  );
};

const getValueFromFilteredSum: BucketValueGetter = (data, minObservability) => data.filteredSum.doc_count >= minObservability ? data.filteredSum.sumResult.value : null;

const getValueFromCalculatedAverage: BucketValueGetter = (data, minObservability) => data.calculatedAverage.doc_count >= minObservability ? data.calculatedAverage.value : null;

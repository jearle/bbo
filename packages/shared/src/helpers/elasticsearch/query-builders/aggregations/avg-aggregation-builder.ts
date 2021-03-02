import {currencyMapper, date_histogram, generateFilter} from "./shared";
import {Aggregation, AggregationType, Currency} from "../../../types";

const sqfootToSqMeter = 0.0929;

export const createAvgAggs = ({aggregationType, currency = 'USD'}: Aggregation) => {
  let fields;
  let filter;
  try {
    fields = determineWhichFieldsToSumOn(aggregationType, currency);
    filter = generateFilter(aggregationType);
  } catch {
    fields = undefined;
    filter = undefined;
  }

  const multiplier = aggregationType === 'PPSM' ? sqfootToSqMeter : 1;

  const initialAgg = {
    calculatedAverage: {
      bucket_script: {
        buckets_path: {
          num: 'filteredSum_0>sumResult',
          div: 'filteredSum_1>sumResult'
        },
        script: `params.num / (params.div * ${multiplier})`
      }
    },
  }
  const innerAggs = fields?.reduce((acc, field, idx) => ({
    ...acc,
    [`filteredSum_${idx}`]: {
      filter,
      aggs: {
        sumResult: {
          sum: {
            field: field,
          },
        },
      },
    }
  }), initialAgg);

  return {
    avgPerQuarter: {
      date_histogram,
      aggs: innerAggs
    }
  }
}
const determineWhichFieldsToSumOn = (
  aggregationType: AggregationType,
  currency: Currency
) => {

  const aggregationTypeUpperCase = aggregationType.toUpperCase();
  const priceField = currencyMapper[currency] ? `statusPrice_amt.${currencyMapper[currency]}` : null;
  if (priceField) {
    switch (aggregationTypeUpperCase) {
      case 'PPU':
        return [priceField, 'units_dbl']
      case 'PPSF':
      case 'PPSM':
        return [priceField, 'sqFt_dbl']
      default:
        throw `fields do not exist for avg-aggregation ${aggregationType}`;
    }
  } else {
    throw `currency ${currency} does not exist for aggregation`;
  }

};

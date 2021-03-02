import { Aggregation, AggregationType, Currency } from '../../../types';
import {currencyMapper, date_histogram, generateFilter} from "./shared";

const determineWhatFieldToSumOn = (
  aggregationType: AggregationType,
  currency: Currency
) => {
  const aggregationTypeUpperCase = aggregationType.toUpperCase();
  if (aggregationTypeUpperCase === 'PRICE') {
    if (currencyMapper[currency]) {
      return `statusPriceAdjusted_amt.${currencyMapper[currency]}`;
    } else {
      throw 'currency does not exist for aggregation';
    }
  } else if (aggregationTypeUpperCase === 'PROPERTY') {
    return 'numberOfProperties_nb';
  } else if (aggregationTypeUpperCase === 'UNITS') {
    return 'units_dbl';
  } else if (aggregationTypeUpperCase === 'SQFT') {
    return 'sqFt_dbl';
  } else {
    throw 'field does not exist for sum-aggregation';
  }
};

export const createSumAggs = ({
  aggregationType,
  currency = 'USD',
}: Aggregation) => {
  let field;
  let filter;
  try {
    field = determineWhatFieldToSumOn(aggregationType, currency);
    filter = generateFilter(aggregationType);
  } catch {
    field = undefined;
    filter = undefined;
  }

  return {
    sumPerQuarter: {
      date_histogram,
      aggs: {
        filteredSum: {
          filter,
          aggs: {
            sumResult: {
              sum: {
                field,
              },
            },
          },
        },
      },
    },
  }
};

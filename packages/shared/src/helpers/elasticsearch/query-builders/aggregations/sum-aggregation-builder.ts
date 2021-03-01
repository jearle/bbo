import { Aggregation, AggregationType, Currency } from '../../../types';

const currencyMapper = {
  USD: 'usd',
  EUR: 'eur',
  CHF: 'chf',
};

const date_histogram = {
  field: 'status_dt',
  calendar_interval: 'quarter',
  format: 'YYYY-MM-dd',
  min_doc_count: 0,
};

const priceFloorFilter = {
  bool: {
    should: [
      {
        bool: {
          must: [
            {
              range: {
                dealStatusPriceUSD_amt: {
                  gte: 2500000,
                },
              },
            },
          ],
        },
      },
    ],
  },
};

const determineWhatFieldToSumOn = (
  aggregationType: AggregationType,
  currency: Currency
) => {
  const aggregationTypeUpperCase = aggregationType.toUpperCase();
  if (aggregationTypeUpperCase === 'PRICE') {
    if (currencyMapper[currency]) {
      return [`statusPriceAdjusted_amt.${currencyMapper[currency]}`];
    } else {
      throw 'currency does not exist for aggregation';
    }
  } else if (aggregationTypeUpperCase === 'PROPERTY') {
    return ['numberOfProperties_nb'];
  } else if (aggregationTypeUpperCase === 'UNITS') {
    return ['units_dbl'];
  } else if (aggregationTypeUpperCase === 'SQFT') {
    return ['sqFt_dbl'];
  } else if (aggregationTypeUpperCase === 'PPU') {
    return [`statusPrice_amt.${currencyMapper[currency]}`, 'units_dbl']
  } else {
    throw 'field does not exist for aggregation';
  }
};

const determineEligibilityFlags = (aggregationType: AggregationType) => {
  const defaultEligibilityFlags = ['eligibleForStats_fg', 'eligibleTTVolume_fg'];

  switch(aggregationType) {
    case "PPU":
      return ['eligibleForPPU_fg'].concat(defaultEligibilityFlags);
    default:
      return defaultEligibilityFlags;
  }
}

const generateFilter = (aggregationType: AggregationType) => {
  const aggregationTypeUpperCase = aggregationType.toUpperCase();
  const eligibilityFlags = determineEligibilityFlags(aggregationType);
  const filters: unknown[] = eligibilityFlags.map(eligibilityFlag => ({
    term: {
      [`${eligibilityFlag}`]: true
    }
  }));
  if (['PRICE', 'UNITS', 'PROPERTY', 'SQFT'].includes(aggregationTypeUpperCase)) {
    filters.push(priceFloorFilter)
  }
  return {
    bool: {
      must: filters
    },
  };
};

export const createAggs = ({
  aggregationType,
  currency = 'USD',
}: Aggregation) => {
  let fields;
  let filter;
  try {
    fields = determineWhatFieldToSumOn(aggregationType, currency);
    filter = generateFilter(aggregationType);
  } catch {
    fields = undefined;
    filter = undefined;
  }
  if (aggregationType === "PPU") {
    return createAvgAggs(fields, filter)
  }
  return createSumAggs(fields[0], filter);
};

const createSumAggs = (field: string, filter) => ({
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
});

const createAvgAggs = (fields: string[], filter) => {
  const initialAgg = {
    calculatedAverage: {
      bucket_script: {
        buckets_path: {
          num: 'filteredSumPerQuarter_0>sumResult',
          div: 'filteredSumPerQuarter_1>sumResult'
        },
        script: 'params.num / params.div'
      }
    },
  }
  const innerAggs = fields.reduce((acc, field, idx) => ({
    ...acc,
    [`filteredSumPerQuarter_${idx}`]: {
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
    quarterlyAverage: {
      date_histogram,
      aggs: innerAggs
    }
  }
}

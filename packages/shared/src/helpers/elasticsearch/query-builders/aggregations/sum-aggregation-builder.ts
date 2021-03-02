import { Aggregation, AggregationType, Currency } from '../../../types';
import { quarters } from '../date-builder';

const date_histogram = {
  field: 'status_dt',
  calendar_interval: 'quarter',
  format: 'YYYY-MM-dd',
  min_doc_count: 0,
};

const currencyMapper = {
  USD: 'usd',
  EUR: 'eur',
  CHF: 'chf',
};

const metricAggregationMapper = {
  PRICE: 'sum',
  PROPERTY: 'sum',
  UNITS: 'sum',
  SQFT: 'sum',
  CAPRATE: 'avg',
};

const priceFloorFilter = { range: { dealStatusPriceUSD_amt: { gte: 2500000 } }};

const volumeFilter = {
  bool: {
    must: [
      {
        term: {
          eligibleForStats_fg: true,
        },
      },
      {
        term: {
          eligibleTTVolume_fg: true,
        },
      },
      priceFloorFilter,
    ],
  },
};

const capRateFilter = {
  bool: {
    must: [
      {
        term: {
          eligibleForCapRates_fg: true,
        },
      },
      {
        term: {
          eligibleForStats_fg: true,
        },
      },
      {
        terms: {
          transType_id: [1, 2, 3],
        },
      },
      {
        term: {
          status_id: 1,
        },
      },
      priceFloorFilter,
    ],
  },
};

const determineWhatFieldToSumOn = (
  aggregationTypeUpperCase: AggregationType,
  currency: Currency
) => {
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
  } else if (aggregationTypeUpperCase === 'CAPRATE') {
    return 'statusCapRate_dbl';
  } else {
    throw 'field does not exist for aggregation';
  }
};

const generateFilter = (aggregationTypeUpperCase: AggregationType) => {
  if (
    ['PRICE', 'UNITS', 'PROPERTY', 'SQFT'].includes(aggregationTypeUpperCase)
  ) {
    return volumeFilter;
  } else if (aggregationTypeUpperCase === 'CAPRATE') {
    return capRateFilter;
  }
};

export const createAggs = ({
  aggregationType,
  currency = 'USD',
}: Aggregation) => {
  let field;
  let filter;
  let metricAggregation;
  try {
    const aggregationTypeUpperCase = aggregationType.toUpperCase() as AggregationType
    field = determineWhatFieldToSumOn(aggregationTypeUpperCase, currency);
    filter = generateFilter(aggregationTypeUpperCase);
    metricAggregation = metricAggregationMapper[aggregationTypeUpperCase];
  } catch {
    field = undefined;
    filter = undefined;
  }
  return {
    sumPerQuarter: {
      range: {
        field: "status_dt",
        ranges: quarters
      },
      aggs: {
          filteredSum: {
            filter,
            aggs: {
              sumResult: {
                [metricAggregation]: {
                  field: field,
                },
              },
            },
          },
        },
      },
    }
};
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

const bool = {
  bool: {
    should: [
      {
        bool: {
          must: [
            {
              range: {
                dealStatusPriceUSD_amt: {
                  gte: 10000000,
                },
              },
            },
          ],
        },
      },
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
    throw 'field does not exist for aggregation';
  }
};

const generateFilter = (aggregationType: AggregationType) => {
  const aggregationTypeUpperCase = aggregationType.toUpperCase();
  if (
    ['PRICE', 'UNITS', 'PROPERTY', 'SQFT'].includes(aggregationTypeUpperCase)
  ) {
    return {
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
          bool,
        ],
      },
    };
  } else {
    return {
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
        ],
      },
    };
  }
};

export const createAggs = ({
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
                field: field,
              },
            },
          },
        },
      },
    },
  };
};

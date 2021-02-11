import { Aggregation } from '../../../types';

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

const filter = {
  bool: {
    must: [
      {
        term: {
          eligibleTTVolume_fg: true,
        },
      },
    ],
  },
};

const determineWhatFieldToSumOn = (aggregationTypeUpperCase, currency) => {
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

export const createAggs = ({
  aggregationType,
  currency = 'USD',
}: Aggregation) => {
  let field;
  const aggregationTypeUpperCase = aggregationType.toUpperCase();
  try {
    field = determineWhatFieldToSumOn(aggregationTypeUpperCase, currency);
  } catch {
    field = undefined;
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

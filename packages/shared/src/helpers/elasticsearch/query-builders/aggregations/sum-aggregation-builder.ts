import { Aggregation, AggregationType, Currency } from '../../../types/aggregations';

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

const determineWhatFieldToSumOn = (aggregationType, currency) => {
  if (aggregationType === 'price') {
    if (currencyMapper[currency]) {
      return `statusPriceAdjusted_amt.${currencyMapper[currency]}`;
    }
    else {
      throw 'currency does not exist for aggregation';
    }
  } else if (aggregationType === 'property') {
    return 'numberOfProperties_nb';
  } else {
    throw 'field does not exist for aggregation';
  }
};

export const createAggs = ({aggregationType, currency = 'USD'}: Aggregation) => {
  let field;
  try {
    field = determineWhatFieldToSumOn(aggregationType, currency);
  }
  catch {
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
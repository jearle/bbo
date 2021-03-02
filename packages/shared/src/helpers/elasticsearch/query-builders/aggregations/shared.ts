import {AggregationType} from "../../../types";

export const currencyMapper = {
  USD: 'usd',
  EUR: 'eur',
  CHF: 'chf',
};

export const date_histogram = {
  field: 'status_dt',
  calendar_interval: 'quarter',
  format: 'YYYY-MM-dd',
  min_doc_count: 0,
};

export const priceFloorFilter = {
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


export const determineEligibilityFlags = (aggregationType: AggregationType) => {
  const defaultEligibilityFlags = ['eligibleForStats_fg', 'eligibleTTVolume_fg'];

  switch(aggregationType.toUpperCase()) {
    case 'PPU':
    case 'PPSF':
    case 'PPSM':
      return ['eligibleTTPPU_fg'].concat(defaultEligibilityFlags);
    default:
      return defaultEligibilityFlags;
  }
}

export const generateFilter = (aggregationType: AggregationType) => {
  const aggregationTypeUpperCase = aggregationType.toUpperCase();
  const eligibilityFlags = determineEligibilityFlags(aggregationType);
  const filters: unknown[] = eligibilityFlags.map(eligibilityFlag => ({
    term: {
      [`${eligibilityFlag}`]: true
    }
  }));
  if (['PRICE', 'UNITS', 'PROPERTY', 'SQFT', 'PPU', 'PPSF', 'PPSM'].includes(aggregationTypeUpperCase)) {
    filters.push(priceFloorFilter)
  }
  return {
    bool: {
      must: filters
    },
  };
};

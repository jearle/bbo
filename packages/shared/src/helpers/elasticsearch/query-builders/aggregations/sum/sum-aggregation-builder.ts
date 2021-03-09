import { Aggregation, AggregationType } from '../../../../types';
import {SumType} from "./index";
import {Currency, isValidCurrency} from "../../../../types/currency";

const currencyMapper = (currency: Currency): string => {
  if (currency.toUpperCase() === 'LOC') {
    return 'local'
  }
  if (currency.toUpperCase() === 'CAN') {
    return 'cad';
  }
  return currency.toLowerCase();
}

const metricAggregationMapper = {
  PRICE: 'sum',
  PROPERTY: 'sum',
  UNITS: 'sum',
  SQFT: 'sum',
  CAPRATE: 'avg',
  PPU_PRICE: 'sum',
  PPU_UNITS: 'sum',
  PPSF_PRICE: 'sum',
  PPSF_SQFT: 'sum',
  PPSM_PRICE: 'sum',
  PPSM_SQFT: 'sum'
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


const ppuFilter = {
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
      {
        term: {
          eligibleTTPPU_fg: true,
        },
      },
      priceFloorFilter,
    ],
  },
};

const determineWhatFieldToSumOn = (
  sumType: SumType,
  currency: Currency
) => {
  const currencyError = `currency does not exist for ${sumType} sum aggregation type`;
  switch (sumType) {
    case 'PRICE':
      if (isValidCurrency(currency)) {
        return `statusPriceAdjusted_amt.${currencyMapper(currency)}`;
      } else {
        throw currencyError;
      }
    case 'PROPERTY':
      return 'numberOfProperties_nb';
    case 'UNITS':
    case 'PPU_UNITS':
      return 'units_dbl';
    case 'SQFT':
    case 'PPSF_SQFT':
    case 'PPSM_SQFT':
      return 'sqFt_dbl';
    case 'CAPRATE':
      return 'statusCapRate_dbl';
    case 'PPU_PRICE':
    case 'PPSF_PRICE':
    case 'PPSM_PRICE':
      if (isValidCurrency(currency)) {
        return `statusPrice_amt.${currencyMapper(currency)}`;
      } else {
        throw currencyError;
      }
    default:
      throw 'field does not exist for sum-aggregation';
  }
};

const generateFilter = (aggregationTypeUpperCase: AggregationType) => {
  if (
    ['PRICE', 'UNITS', 'PROPERTY', 'SQFT'].includes(aggregationTypeUpperCase)
  ) {
    return volumeFilter;
  } else if (aggregationTypeUpperCase === 'CAPRATE') {
    return capRateFilter;
  } else if (['PPU', 'PPSF', 'PPSM'].includes(aggregationTypeUpperCase)) {
    return ppuFilter;
  }
};

const getSumTypeForAgg = (aggregationType: AggregationType, numerator?: boolean): SumType => {
  switch (aggregationType) {
    case 'PPU':
      return numerator ? "PPU_PRICE" : 'PPU_UNITS';
    case 'PPSF':
      return numerator ? "PPSF_PRICE" : 'PPSF_SQFT';
    case 'PPSM':
      return numerator ? "PPSM_PRICE" : 'PPSM_SQFT';
    default:
      return aggregationType as SumType;
  }
}

export const createAggs = ({
  aggregationType,
  currency = 'USD',
}: Aggregation) => {
  let field;
  let filter;
  let metricAggregation;
  try {
    const aggregationTypeUpperCase = aggregationType.toUpperCase() as AggregationType;
    const sumType = getSumTypeForAgg(aggregationTypeUpperCase);
    field = determineWhatFieldToSumOn(sumType, currency);
    filter = generateFilter(aggregationTypeUpperCase);
    metricAggregation = metricAggregationMapper[sumType];
  } catch {
    field = undefined;
    filter = undefined;
    metricAggregation = undefined;
  }

  return {
    filteredSum: createInnerAggs(filter, metricAggregation, field)
  }
};

export const createCalculatedAverageAggs = ({
  aggregationType,
  currency = 'USD',
}: Aggregation) => {

  let filter;
  let numField;
  let divField;
  let numMetricAggregation;
  let divMetricAggregation;
  const aggregationTypeUpperCase = aggregationType.toUpperCase() as AggregationType;
  try {
    const numSumType = getSumTypeForAgg(aggregationTypeUpperCase, true);
    const divSumType = getSumTypeForAgg(aggregationTypeUpperCase, false);
    numField = determineWhatFieldToSumOn(numSumType, currency);
    divField = determineWhatFieldToSumOn(divSumType, currency);
    filter = generateFilter(aggregationTypeUpperCase);
    numMetricAggregation = metricAggregationMapper[numSumType];
    divMetricAggregation = metricAggregationMapper[divSumType];
  } catch {
    filter = undefined;
    numField = undefined;
    divField = undefined;
    numMetricAggregation = undefined;
    divMetricAggregation = undefined;
  }
  const multiplier = aggregationTypeUpperCase === 'PPSM' ? 0.0929 : 1;

  return {
    calculatedAverage: {
      bucket_script: {
        buckets_path: {
          num: 'numSum>sumResult',
          div: 'divSum>sumResult'
        },
        script: `params.num / (params.div * ${multiplier})`
      }
    },
    numSum: createInnerAggs(filter, numMetricAggregation, numField),
    divSum: createInnerAggs(filter, divMetricAggregation, divField)
  }
}

export const createInnerAggs = (filter, metricAggregation, field) => {
  return {
    filter,
    aggs: {
      sumResult: {
        [metricAggregation]: {
          field: field,
        },
      },
    },
  };
}

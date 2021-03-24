import { Aggregation, AggregationType } from '../../../../types';
import { SumType, rentableAreaSumTypes } from './index';
import { Currency, isValidCurrency } from '../../../../types/currency';
import { RentableArea } from '../../../../types/rentable-area';

const currencyMapper = (currency: Currency): string => {
  if (currency.toUpperCase() === 'LOC') {
    return 'local';
  }
  if (currency.toUpperCase() === 'CAN') {
    return 'cad';
  }
  return currency.toLowerCase();
};

const metricAggregationMapper = {
  PRICE: 'sum',
  PROPERTY: 'sum',
  UNITS: 'sum',
  AREA: 'sum',
  CAPRATE: 'avg',
  PPU_PRICE: 'sum',
  PPU_UNITS: 'sum',
  PPA_PRICE: 'sum',
  PPA_SQFT: 'sum',
};

const priceFloorFilter = {
  range: { dealStatusPriceUSD_amt: { gte: 2500000 } },
};

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

const determineWhatFieldToSumOn = (sumType: SumType, currency: Currency) => {
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
    case 'AREA':
    case 'PPA_SQFT':
      return 'sqFt_dbl';
    case 'CAPRATE':
      return 'statusCapRate_dbl';
    case 'PPU_PRICE':
    case 'PPA_PRICE':
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
    ['PRICE', 'UNITS', 'PROPERTY', 'AREA'].includes(aggregationTypeUpperCase)
  ) {
    return volumeFilter;
  } else if (aggregationTypeUpperCase === 'CAPRATE') {
    return capRateFilter;
  } else if (['PPU', 'PPA'].includes(aggregationTypeUpperCase)) {
    return ppuFilter;
  }
};

const getSumTypeForAgg = (
  aggregationType: AggregationType,
  numerator?: boolean
): SumType => {
  switch (aggregationType) {
    case 'PPU':
      return numerator ? 'PPU_PRICE' : 'PPU_UNITS';
    case 'PPA':
      return numerator ? 'PPA_PRICE' : 'PPA_SQFT';
    default:
      return aggregationType as SumType;
  }
};

const generateMetricAggregation = (
  sumType: SumType,
  field: string,
  rentableArea?: RentableArea
) => {
  const metricAggregation = metricAggregationMapper[sumType];
  let agg;
  if (rentableAreaSumTypes.includes(sumType) && rentableArea === 'SQMT') {
    agg = {
      field,
      script: {
        source: `_value * 0.092903`,
      },
    };
  } else {
    agg = {
      field,
    };
  }
  return {
    [metricAggregation]: agg,
  };
};

export const createAggs = ({
  aggregationType,
  currency,
  rentableArea,
}: Aggregation) => {
  let filter;
  let metricAggregation;
  try {
    const aggregationTypeUpperCase = aggregationType.toUpperCase() as AggregationType;
    const sumType = getSumTypeForAgg(aggregationTypeUpperCase);
    const field = determineWhatFieldToSumOn(sumType, currency);
    filter = generateFilter(aggregationTypeUpperCase);
    metricAggregation = generateMetricAggregation(sumType, field, rentableArea);
  } catch {
    filter = undefined;
    metricAggregation = undefined;
  }

  return {
    filteredSum: createInnerAggs(filter, metricAggregation),
  };
};

export const createCalculatedAverageAggs = ({
  aggregationType,
  currency,
  rentableArea,
}: Aggregation) => {
  let filter;
  let numMetricAggregation;
  let divMetricAggregation;
  const aggregationTypeUpperCase = aggregationType.toUpperCase() as AggregationType;
  try {
    const numSumType = getSumTypeForAgg(aggregationTypeUpperCase, true);
    const divSumType = getSumTypeForAgg(aggregationTypeUpperCase, false);
    const numField = determineWhatFieldToSumOn(numSumType, currency);
    const divField = determineWhatFieldToSumOn(divSumType, currency);
    filter = generateFilter(aggregationTypeUpperCase);
    numMetricAggregation = generateMetricAggregation(
      numSumType,
      numField,
      rentableArea
    );
    divMetricAggregation = generateMetricAggregation(
      divSumType,
      divField,
      rentableArea
    );
  } catch {
    filter = undefined;
    numMetricAggregation = undefined;
    divMetricAggregation = undefined;
  }

  return {
    calculatedAverage: {
      bucket_script: {
        buckets_path: {
          num: 'numSum>sumResult',
          div: 'divSum>sumResult',
        },
        script: `params.num / params.div`,
      },
    },
    numSum: createInnerAggs(filter, numMetricAggregation),
    divSum: createInnerAggs(filter, divMetricAggregation),
  };
};

export const createInnerAggs = (filter, metricAggregation) => {
  return {
    filter,
    aggs: {
      sumResult: metricAggregation,
    },
  };
};

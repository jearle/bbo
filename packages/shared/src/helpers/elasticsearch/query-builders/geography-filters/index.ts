import { map, chain } from 'lodash';
import * as Geography from '../../../types/geography';

const parseStateProv = (id: number): string => {
  switch (parseInt((id / 1000000).toString())) { // stateProv can be adminLevel 1,2, or 3 which we can determine based on its id value
    case 1:
      return 'adminLevel1_id';
    case 2:
      return 'adminLevel2_id';
    case 3:
      return 'adminLevel3_id';
    default:
      // try as Adminlevel1, that's the best case scenario
      return 'adminLevel1_id';
  }
};

const getKey = (item: Geography.Filter): string => {
  const field = Geography.FieldMappings.get(item.type);
  let key = '';
  if (field === undefined) {
    throw 'Unknown Geo Type';
  } else if (field === 'stateProv') {
    key = parseStateProv(item.id);
  } else {
    key = field;
  }

  return key;
};

const getValue = (item: Geography.Filter): number => {
  return item.type === Geography.Types.StateProv ? item.id % 1000000 : item.id;
};

type GeograpyFilterTerm = {
  terms: {
    [key: string]: number[]
  }
}

export const createGeographyFilterTerms = (items: Geography.Filter[], prefixKey = ''): GeograpyFilterTerm[] => {
  return chain(items)
    .groupBy(getKey)
    .map((values, key) => {
      const mappedValues = map(values, (value) => getValue(value));
      return {
        terms: {
          [prefixKey + key]: mappedValues
        }
      }
    }).value();
};


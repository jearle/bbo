import { forEach, map, groupBy, chain } from 'lodash';

export enum GeographyTypes {
  RCAZone = 0,
  Continent,
  RCATheatre,
  RCASubTheatre,
  Country,
  Region,
  Metro,
  Market,
  SubMarket,
  PostalCode,
  StateProv,
  County,
  City,
  MarketTier,
  Address,
  PropertyName,
  Neighborhood,
}

const GeographyFieldMappings: Map<GeographyTypes, string> = new Map([
  [GeographyTypes.RCAZone, 'newZone_id'],
  [GeographyTypes.Continent, 'newContinent_id'],
  [GeographyTypes.RCATheatre, 'newTheatre_id'],
  [GeographyTypes.RCASubTheatre, 'newSubTheatre_id'],
  [GeographyTypes.Country, 'adminLevel0_id'],
  [GeographyTypes.Region, 'newRegion_id'],
  [GeographyTypes.Metro, 'newMetro_id'],
  [GeographyTypes.Market, 'newMarket_id'],
  [GeographyTypes.SubMarket, 'newSubMarket_id'],
  [GeographyTypes.PostalCode, 'newPostalCode_id'],
  [GeographyTypes.StateProv, 'stateProv'],
  [GeographyTypes.County, 'adminLevel2_id'],
  [GeographyTypes.City, 'newCity_id'],
  [GeographyTypes.MarketTier, 'newMarketTier_id'],
  [GeographyTypes.Neighborhood, 'neighborhood_id']
]);

export interface IGeographyFilter {
  name: string;
  id: number;
  type: GeographyTypes;
};

// 
/**
 * returns the mapped kv pairs of geography type and id
 * @param items array of GeographyFilters
 * @param prefixKey = ''. prefix could be company_ if we are searching investors index
 */
export const createGeographyFilterTerms = (items: IGeographyFilter[], prefixKey = '') => {
  const getKey = (item: IGeographyFilter): string => {
    const name = GeographyFieldMappings.get(item.type);
    const key = () => {
      if (name === undefined) {
        throw 'Unknown Type';
      } else if (name === 'stateProv') {
        switch (parseInt((item.id / 1000000).toString())) { // stateProv can be adminLevel 1,2, or 3 which we can determine based on its id value
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
      } else {
        return name;
      }
    };
    return prefixKey + key();
  };

  const getValue = (item: IGeographyFilter): number => {
    return item.type === GeographyTypes.StateProv ? item.id % 1000000 : item.id;
    //   old city_id, probably dont need to support but should confirm with Yi or MG
    //   //if the OLD style of City_id is passed in, remove the prepend, this would only be for a saved search
    //   return item.id > 1000000 ? item.id - 1000000 : item.id; 
  };

  const kvPairs = chain(items)
    .groupBy(getKey)
    .map((values, key) => {
      const mappedValues = map(values, (value) => getValue(value));
      return { [key]: mappedValues }
    }).value();

  return kvPairs;
};


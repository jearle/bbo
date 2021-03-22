import { FlatGeographies } from '../../../types';
export enum Types {
  RCAZone = 0,
  Continent = 1,
  RCATheatre = 2,
  RCASubTheatre = 3,
  Country = 4,
  Region = 5,
  Metro = 6,
  Market = 7,
  SubMarket = 8,
  PostalCode = 9,
  StateProv = 10,
  County = 11,
  City = 12,
  MarketTier = 13,
  Address = 14,
  PropertyName = 15,
  Neighborhood = 16,
}

export declare const FieldMappings: Map<Types, string>;
export declare type Filter = {
  id: number;
  type: Types;
};

export declare type Geography = {
  id: number;
  type: Types;
  name: string;
  menuId: number;
  zoneTab: string;
  indent: number;
};

export const mapFlatGeographies = (
  flatGeographies: FlatGeographies
): Geography[] => {
  return flatGeographies.map((item) => {
    const { id, type } = findGeographyIdAndType(item);
    return {
      id,
      type,
      name: item.box2,
      menuId: item.geoMenu_id,
      zoneTab: item.zonetab,
      indent: item.indent,
    };
  });
};

const findGeographyIdAndType = (geography) => {
  if (geography.RCAZone_id || geography.RCAZone_id == 0) {
    return {
      id: geography.RCAZone_id,
      type: Types.RCAZone,
    };
  }
  if (geography.RCATheatre_id || geography.RCATheatre_id == 0) {
    return {
      id: geography.RCATheatre_id,
      type: Types.RCATheatre,
    };
  }
  if (geography.RCASubTheatre_id || geography.RCASubTheatre_id == 0) {
    return {
      id: geography.RCASubTheatre_id,
      type: Types.RCASubTheatre,
    };
  }
  if (geography.continent_id || geography.continent_id == 0) {
    return {
      id: geography.continent_id,
      type: Types.Continent,
    };
  }
  if (geography.country_id || geography.country_id == 0) {
    return {
      id: geography.country_id,
      type: Types.Country,
    };
  }
  if (geography.region_id || geography.region_id == 0) {
    return {
      id: geography.region_id,
      type: Types.Region,
    };
  }
  if (geography.metro_id || geography.metro_id == 0) {
    return {
      id: geography.metro_id,
      type: Types.Metro,
    };
  }
  if (geography.market_id || geography.mark == 0) {
    return {
      id: geography.market_id,
      type: Types.Market,
    };
  }
  if (geography.submarket_id || geography.submarket_id == 0) {
    return {
      id: geography.submarket_id,
      type: Types.SubMarket,
    };
  }
  if (geography.city_id || geography.city_id == 0) {
    return {
      id: geography.city_id,
      type: Types.City,
    };
  }
  if (geography.stateProv_id || geography.stateProv_id == 0) {
    return {
      id: geography.stateProv_id,
      type: Types.StateProv,
    };
  }
  if (geography.MarketTier_id || geography.MarketTier_id == 0) {
    return {
      id: geography.MarketTier_id,
      type: Types.MarketTier,
    };
  }
  return null;
};

export const mapGeographyToOption = (
  geography: Geography
): { id: number; label: string; value: Geography } => ({
  id: geography?.menuId,
  label: geography?.name,
  value: geography,
});

export const ZoneTheatreName = 'Zone/Theatre';
export const CountryRegionName = 'Country/Region';
export const MetroMarketName = 'Metro/Market';
export const GlobalGeographyName = 'Global';
export const AmericasZoneName = 'Americas';
export const EmeaZoneName = 'EMEA';
export const AsiaPacZoneName = 'AsiaPac';

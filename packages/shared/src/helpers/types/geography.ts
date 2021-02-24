export enum Types {
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

export const FieldMappings: Map<Types, string> = new Map([
  [Types.RCAZone, 'newZone_id'],
  [Types.Continent, 'newContinent_id'],
  [Types.RCATheatre, 'newTheatre_id'],
  [Types.RCASubTheatre, 'newSubTheatre_id'],
  [Types.Country, 'adminLevel0_id'],
  [Types.Region, 'newRegion_id'],
  [Types.Metro, 'newMetro_id'],
  [Types.Market, 'newMarket_id'],
  [Types.SubMarket, 'newSubMarket_id'],
  [Types.PostalCode, 'newPostalCode_id'],
  [Types.StateProv, 'stateProv'],
  [Types.County, 'adminLevel2_id'],
  [Types.City, 'newCity_id'],
  [Types.MarketTier, 'newMarketTier_id'],
  [Types.Neighborhood, 'neighborhood_id'],
]);

export type Filter = {
  name: string;
  id: number;
  type: Types;
};

export const getGeographySearchFieldByTx = (field: string): string => {
  return FieldMappings.get(Types[field]);
};

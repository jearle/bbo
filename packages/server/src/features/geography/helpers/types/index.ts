export type FlatGeography = {
  readonly TrendtrackerData_Geography_id: number;
  readonly geoMenu_id: number;
  readonly sortorder: number;
  readonly box2Value: string;
  readonly box2: string;
  readonly geotype_tx: string;
  readonly zonetab: string;
  readonly definition: string;
  readonly column: number;
  readonly indent: number;
  readonly subHeader: null;
  readonly RCAZone_id: number | null;
  readonly RCATheatre_id: number | null;
  readonly RCASubTheatre_id: number | null;
  readonly continent_id: number | null;
  readonly country_id: number | null;
  readonly region_id: number | null;
  readonly metro_id: number | null;
  readonly market_id: number | null;
  readonly submarket_id: number | null;
  readonly city_id: number | null;
  readonly stateProv_id: number | null;
  readonly MarketTier_id: number | null;
  readonly priceFloor: number;
  readonly startDate: string;
  readonly currencySymbol_tx: string;
  readonly sovereign_Bond_Rate: null;
  readonly permissions_zone_id: number;
  readonly display_fg: boolean;
  readonly hasCPPI_fg: boolean;
  readonly hasSBR_fg: boolean;
  readonly hasNCREIF_fg: boolean;
  readonly propertyTypeCategory_id: number;
};

export type FlatGeographies = FlatGeography[];

export type GeographyValue = {
  readonly id: number;
  readonly type: number;
  readonly name: string;
  readonly menuId: number;
  readonly zoneTab: string;
  readonly indent: number;
};

export type Geography = {
  readonly label: string;
  readonly id: string;
  readonly value: GeographyValue;
  readonly options: Geographies;
};

export type Geographies = Geography[];

export type GeographyMenu = {
  readonly Americas: Geographies;
  readonly EMEA: Geographies;
  readonly AsiaPac: Geographies;
  readonly Global: Geographies;
};

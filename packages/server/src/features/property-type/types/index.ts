export type RawPropertyType = {
  readonly PTSMenu_id: number;

  // Type
  readonly Type1_id: number;
  readonly Type1_tx: string;
  readonly Type1Full_tx: string;
  readonly Type1Abbreviated_tx: string;
  readonly Type1_cd: string;
  readonly Type1Order_nb: number;
  readonly Type1Priority_nb: number;
  readonly Type1SourceTable_tx: string;

  // SubType
  readonly Type2_id: number | null;
  readonly Type2_tx: string | null;
  readonly Type2Full_tx: string | null;
  readonly Type2Order_nb: number | null;
  readonly Type2Priority_nb: 6;
  readonly Type2SourceTable_tx: number | null;

  // Feature
  readonly Type3_id: number | null;
  readonly Type3_tx: string | null;
  readonly Type3Full_tx: string | null;
  readonly Type3Order_nb: number | null;
  readonly Type3Priority_nb: number | null;
  readonly Type3SourceTable_tx: string | null;

  readonly SyntheticId_tx: string;
};

export type FeatureType = {
  readonly __raw_property_type__: RawPropertyType;
  readonly id: string;
  readonly parentId?: string;
  readonly slug: string;
  readonly parentSlug?: string;
  readonly label: string;
};

export type PropertyType = {
  readonly __raw_property_type__: RawPropertyType;
  readonly id: string;
  readonly slug: string;
  readonly label: string;
  readonly subPropertyTypes: PropertyType[];
  readonly featureTypes: FeatureType[];
};

export type SubPropertyType = {
  readonly __raw_property_type__: RawPropertyType;
  readonly id: string;
  readonly parentId?: string;
  readonly slug: string;
  readonly parentSlug?: string;
  readonly label: string;
  readonly featureTypes: FeatureType[];
};

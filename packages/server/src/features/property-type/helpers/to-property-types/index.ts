import {
  RawPropertyType,
  PropertyType,
  PropertySubType,
  FeatureType,
} from '../../types';

type ToPropertyTypesInputs = {
  readonly rawPropertyTypes: RawPropertyType[];
};

type AllRawPropertyTypesInput = {
  readonly allRawPropertyTypes: RawPropertyType[];
};

type RawFeatureTypesInput = {
  readonly rawFeatureTypes: RawPropertyType[];
};

const createSlug = ({
  propertyTypeLabel,
  propertySubTypeLabel,
  featureTypeLabel,
}) => {
  /* istanbul ignore next */
  const fullLabel = `${propertyTypeLabel || ``} ${propertySubTypeLabel || ``} ${
    featureTypeLabel || ``
  }`;

  const slug = fullLabel
    .toLowerCase()
    .trim()
    .replace(/[^a-zA-Z0-9 \s+]/g, ' ')
    .replace(/\s+/g, '-');

  return slug;
};

const filterRawPropertyTypeFeatures = ({
  allRawPropertyTypes,
}: AllRawPropertyTypesInput) => {
  const rawPropertySubTypeFeatures = allRawPropertyTypes.filter(
    (rawPropertyType) => {
      const { Type2_id, Type3_id } = rawPropertyType;

      return Type2_id === null && Type3_id !== null;
    }
  );

  return rawPropertySubTypeFeatures;
};

const filterRawPropertySubTypeFeatures = ({
  allRawPropertyTypes,
}: AllRawPropertyTypesInput) => {
  const rawPropertySubTypeFeatures = allRawPropertyTypes.filter(
    (rawPropertyType) => {
      const { Type2_id, Type3_id } = rawPropertyType;

      return Type2_id !== null && Type3_id !== null;
    }
  );

  return rawPropertySubTypeFeatures;
};

const filterRawPropertySubTypes = ({
  allRawPropertyTypes,
}: AllRawPropertyTypesInput) => {
  const rawPropertySubTypes = allRawPropertyTypes.filter((rawPropertyType) => {
    const { Type2_id, Type3_id } = rawPropertyType;

    return Type2_id !== null && Type3_id === null;
  });

  return rawPropertySubTypes;
};

const filterRawPropertyTypes = ({
  allRawPropertyTypes,
}: AllRawPropertyTypesInput) => {
  const propertyTypes = allRawPropertyTypes.filter((rawPropertyType) => {
    const { Type2_id, Type3_id } = rawPropertyType;

    return Type2_id === null && Type3_id === null;
  });

  return propertyTypes;
};

const createFeatureTypes = ({
  rawFeatureTypes,
}: RawFeatureTypesInput): FeatureType[] => {
  const featureTypes = rawFeatureTypes.map((rawFeatureType) => {
    const __raw_property_type__ = rawFeatureType;
    const {
      PTSMenu_id,
      Type1Full_tx: propertyTypeLabel,
      Type2Full_tx: propertySubTypeLabel,
      Type3Full_tx: label,
    } = rawFeatureType;
    const id = PTSMenu_id.toString();
    const slug = createSlug({
      propertyTypeLabel,
      propertySubTypeLabel,
      featureTypeLabel: label,
    });

    return {
      __raw_property_type__,
      id,
      label,
      slug,
    };
  });

  return featureTypes;
};

const createPropertySubTypes = ({
  rawPropertySubTypes,
  propertySubFeatureTypes,
}): PropertySubType[] => {
  const propertySubTypes = rawPropertySubTypes.map((rawPropertySubType) => {
    const __raw_property_type__ = rawPropertySubType;
    const {
      PTSMenu_id,
      Type1Full_tx: propertyTypeLabel,
      Type2Full_tx: label,
      Type3Full_tx: featureTypeLabel,
    } = rawPropertySubType;
    const id = PTSMenu_id.toString();
    const slug = createSlug({
      propertyTypeLabel,
      propertySubTypeLabel: label,
      featureTypeLabel,
    });

    const featureTypes = propertySubFeatureTypes
      .filter((propertySubFeatureType) => {
        const {
          __raw_property_type__: rawPropertySubFeatureType,
        } = propertySubFeatureType;

        return (
          rawPropertySubFeatureType.Type2_id === rawPropertySubType.Type2_id
        );
      })
      .map((featureType) => ({
        parentId: id,
        parentSlug: slug,
        ...featureType,
      }));

    return {
      __raw_property_type__,
      id,
      label,
      slug,
      propertySubTypes: [],
      featureTypes,
    };
  });

  return propertySubTypes;
};

const createPropertyTypes = ({
  rawPropertyTypes,
  propertyFeatureTypes,
  propertySubTypes: allPropertySubTypes,
}): PropertyType[] => {
  return rawPropertyTypes.map((rawPropertyType) => {
    const __raw_property_type__ = rawPropertyType;
    const {
      PTSMenu_id,
      Type1Full_tx: label,
      Type2Full_tx: propertySubTypeLabel,
      Type3Full_tx: featureTypeLabel,
    } = rawPropertyType;
    const id = PTSMenu_id.toString();
    const slug = createSlug({
      propertyTypeLabel: label,
      propertySubTypeLabel,
      featureTypeLabel,
    });

    const featureTypes = propertyFeatureTypes
      .filter((propertyFeatureType) => {
        const {
          __raw_property_type__: rawPropertyFeatureType,
        } = propertyFeatureType;

        return rawPropertyType.Type1_id === rawPropertyFeatureType.Type1_id;
      })
      .map((featureType) => ({
        parentId: id,
        parentSlug: slug,
        ...featureType,
      }));

    const propertySubTypes = allPropertySubTypes
      .filter((propertySubType) => {
        const { __raw_property_type__: rawPropertySubType } = propertySubType;

        return rawPropertyType.Type1_id === rawPropertySubType.Type1_id;
      })
      .map((propertySubType) => ({
        parentId: id,
        parentSlug: slug,
        ...propertySubType,
      }));

    return {
      __raw_property_type__,
      id,
      label,
      slug,
      propertySubTypes,
      featureTypes,
    };
  });
};

export const toPropertyTypes = ({
  rawPropertyTypes: allRawPropertyTypes,
}: ToPropertyTypesInputs): PropertyType[] => {
  const rawPropertyTypeFeatures = filterRawPropertyTypeFeatures({
    allRawPropertyTypes,
  });

  const propertyFeatureTypes = createFeatureTypes({
    rawFeatureTypes: rawPropertyTypeFeatures,
  });

  const rawPropertySubTypeFeatures = filterRawPropertySubTypeFeatures({
    allRawPropertyTypes,
  });

  const propertySubFeatureTypes = createFeatureTypes({
    rawFeatureTypes: rawPropertySubTypeFeatures,
  });

  const rawPropertySubTypes = filterRawPropertySubTypes({
    allRawPropertyTypes,
  });

  const propertySubTypes = createPropertySubTypes({
    rawPropertySubTypes,
    propertySubFeatureTypes,
  });

  const rawPropertyTypes = filterRawPropertyTypes({ allRawPropertyTypes });
  const propertyTypes = createPropertyTypes({
    rawPropertyTypes,
    propertyFeatureTypes,
    propertySubTypes,
  });

  return propertyTypes;
};

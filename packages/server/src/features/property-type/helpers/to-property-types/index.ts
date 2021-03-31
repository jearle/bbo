import {
  RawPropertyType,
  PropertyType,
  SubPropertyType,
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

const createSlug = ({ id, label }) =>
  label
    .toLowerCase()
    .replace(/[^a-zA-Z0-9 \s+]/g, ' ')
    .replace(/\s+/g, '-') + `-${id}`;

const filterRawPropertyTypeFeatures = ({
  allRawPropertyTypes,
}: AllRawPropertyTypesInput) => {
  const rawSubPropertyTypeFeatures = allRawPropertyTypes.filter(
    (rawPropertyType) => {
      const { Type2_id, Type3_id } = rawPropertyType;

      return Type2_id === null && Type3_id !== null;
    }
  );

  return rawSubPropertyTypeFeatures;
};

const filterRawSubPropertyTypeFeatures = ({
  allRawPropertyTypes,
}: AllRawPropertyTypesInput) => {
  const rawSubPropertyTypeFeatures = allRawPropertyTypes.filter(
    (rawPropertyType) => {
      const { Type2_id, Type3_id } = rawPropertyType;

      return Type2_id !== null && Type3_id !== null;
    }
  );

  return rawSubPropertyTypeFeatures;
};

const filterRawSubPropertyTypes = ({
  allRawPropertyTypes,
}: AllRawPropertyTypesInput) => {
  const rawSubPropertyTypes = allRawPropertyTypes.filter((rawPropertyType) => {
    const { Type2_id, Type3_id } = rawPropertyType;

    return Type2_id !== null && Type3_id === null;
  });

  return rawSubPropertyTypes;
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
    const { PTSMenu_id, Type3Full_tx: label } = rawFeatureType;
    const id = PTSMenu_id.toString();
    const slug = createSlug({ id, label });

    return {
      __raw_property_type__,
      id,
      label,
      slug,
    };
  });

  return featureTypes;
};

const createSubPropertyTypes = ({
  rawSubPropertyTypes,
  subPropertyFeatureTypes,
}): SubPropertyType[] => {
  const subPropertyTypes = rawSubPropertyTypes.map((rawSubPropertyType) => {
    const __raw_property_type__ = rawSubPropertyType;
    const { PTSMenu_id, Type2Full_tx: label } = rawSubPropertyType;
    const id = PTSMenu_id.toString();
    const slug = createSlug({ id, label });

    const featureTypes = subPropertyFeatureTypes
      .filter((subPropertyFeatureType) => {
        const {
          __raw_property_type__: rawSubPropertyFeatureType,
        } = subPropertyFeatureType;

        return (
          rawSubPropertyFeatureType.Type2_id === rawSubPropertyType.Type2_id
        );
      })
      .map((featureType) => ({
        parentId: id,
        ...featureType,
      }));

    return {
      __raw_property_type__,
      id,
      label,
      slug,
      subPropertyTypes: [],
      featureTypes,
    };
  });

  return subPropertyTypes;
};

const createPropertyTypes = ({
  rawPropertyTypes,
  propertyFeatureTypes,
  subPropertyTypes: allSubPropertyTypes,
}): PropertyType[] => {
  return rawPropertyTypes.map((rawPropertyType) => {
    const __raw_property_type__ = rawPropertyType;
    const { PTSMenu_id, Type1Full_tx: label } = rawPropertyType;
    const id = PTSMenu_id.toString();
    const slug = createSlug({ id, label });

    const featureTypes = propertyFeatureTypes
      .filter((propertyFeatureType) => {
        const {
          __raw_property_type__: rawPropertyFeatureType,
        } = propertyFeatureType;

        return rawPropertyType.Type1_id === rawPropertyFeatureType.Type1_id;
      })
      .map((featureType) => ({
        parentId: id,
        ...featureType,
      }));

    const subPropertyTypes = allSubPropertyTypes
      .filter((subPropertyType) => {
        const { __raw_property_type__: rawSubPropertyType } = subPropertyType;

        return rawPropertyType.Type1_id === rawSubPropertyType.Type1_id;
      })
      .map((subPropertyType) => ({
        parentId: id,
        ...subPropertyType,
      }));

    return {
      __raw_property_type__,
      id,
      label,
      slug,
      subPropertyTypes,
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

  const rawSubPropertyTypeFeatures = filterRawSubPropertyTypeFeatures({
    allRawPropertyTypes,
  });

  const subPropertyFeatureTypes = createFeatureTypes({
    rawFeatureTypes: rawSubPropertyTypeFeatures,
  });

  const rawSubPropertyTypes = filterRawSubPropertyTypes({
    allRawPropertyTypes,
  });

  const subPropertyTypes = createSubPropertyTypes({
    rawSubPropertyTypes,
    subPropertyFeatureTypes,
  });

  const rawPropertyTypes = filterRawPropertyTypes({ allRawPropertyTypes });
  const propertyTypes = createPropertyTypes({
    rawPropertyTypes,
    propertyFeatureTypes,
    subPropertyTypes,
  });

  return propertyTypes;
};

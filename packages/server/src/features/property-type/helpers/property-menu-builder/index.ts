import { idToSlug } from '../property-type-slugs';

type PropertyType = {
  readonly TrendtrackerData_PropertyTypes_id: number;
  readonly box3Value: string;
  readonly box3: string;
  readonly display_fg: boolean;
  readonly indent: number;
  readonly propertyType_id: number;
  readonly propertySubType_id: number;
  readonly propertyFeature_id: number;
  readonly PropertySubTypeCategory_id: number;
  readonly definition: string;
  readonly sortOrder: number;
  readonly hotelRating_id: number;
  readonly propertyType_tx: string;
};

type PropertyTypeOption = {
  readonly propertyType: PropertyType;
  readonly id: string;
  readonly parentId: string | null;
  readonly label: string;
  readonly options: PropertyTypeOption[];
  readonly slug: string;
  readonly parentSlug: string | null;
};

const toPropertyTypeOptions = (
  propertyTypes: PropertyType[],
  idKey: `propertyType_id` | `propertySubType_id`
): PropertyTypeOption[] => {
  return propertyTypes.map((propertyType) => {
    const { box3: label, [idKey]: rawId } = propertyType;

    const parentId = null;
    const parentSlug = null;

    const id = `${rawId}`;
    const slug = idToSlug(id);

    return {
      propertyType,
      id,
      parentId,
      slug,
      parentSlug,
      label,
      options: [],
    };
  });
};

const filterParentPropertyTypes = (
  propertyTypes: PropertyType[]
): PropertyType[] => {
  return propertyTypes.filter(({ indent }) => indent === 0);
};

const filterSubPropertyTypes = (
  propertyTypes: PropertyType[]
): PropertyType[] => {
  return propertyTypes.filter(
    ({ propertyFeature_id, PropertySubTypeCategory_id, propertySubType_id }) =>
      propertyFeature_id === null &&
      PropertySubTypeCategory_id === null &&
      propertySubType_id !== null
  );
};

const filterSubPropertyTypeOptionsByParentId = (
  parentId: string,
  subPropertyTypes: PropertyTypeOption[]
): PropertyTypeOption[] => {
  return subPropertyTypes
    .filter((subPropertyType) => {
      const { propertyType_id: subParentId } = subPropertyType.propertyType;

      return parseInt(parentId) === subParentId;
    })
    .map((subPropertyType) => ({
      ...subPropertyType,
      parentId,
      parentSlug: idToSlug(parentId),
      slug: idToSlug(`${parentId}-${subPropertyType.id}`),
    }));
};

const createParentSubRelationship = (
  parentPropertyTypes: PropertyTypeOption[],
  subPropertyTypes: PropertyTypeOption[]
): PropertyTypeOption[] => {
  return parentPropertyTypes.map((parentPropertyType) => {
    const { id } = parentPropertyType;
    const options = filterSubPropertyTypeOptionsByParentId(
      id,
      subPropertyTypes
    );

    return {
      ...parentPropertyType,
      options,
    };
  });
};

export type PropertyTypeMenu = PropertyTypeOption[];

// export const createPropertyTypeMenu = (
//   propertyTypes: PropertyType[]
// ): PropertyTypeMenu => {
//   const parentPropertyTypes = filterParentPropertyTypes(propertyTypes);
//   const parentPropertyTypeOptions = toPropertyTypeOptions(
//     parentPropertyTypes,
//     `propertyType_id`
//   );

//   const subPropertyTypes = filterSubPropertyTypes(propertyTypes);
//   const subPropertyTypeOptions = toPropertyTypeOptions(
//     subPropertyTypes,
//     `propertySubType_id`
//   );

//   const propertyTypeOptions = createParentSubRelationship(
//     parentPropertyTypeOptions,
//     subPropertyTypeOptions
//   );

//   return propertyTypeOptions;
// };

export const createPropertyTypeMenu = (
  propertyTypes: PropertyType[]
): PropertyTypeMenu => {
  // const parentPropertyTypes = filterParentPropertyTypes(propertyTypes);
  // const parentPropertyTypeOptions = toPropertyTypeOptions(
  //   parentPropertyTypes,
  //   `propertyType_id`
  // );

  // const subPropertyTypes = filterSubPropertyTypes(propertyTypes);
  // const subPropertyTypeOptions = toPropertyTypeOptions(
  //   subPropertyTypes,
  //   `propertySubType_id`
  // );

  // const propertyTypeOptions = createParentSubRelationship(
  //   parentPropertyTypeOptions,
  //   subPropertyTypeOptions
  // );

  // return propertyTypeOptions;
  console.log(propertyTypes);
  return [];
};

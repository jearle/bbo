import * as PropertyType from '../../../types/property-type';

type PropertyFilterTerms = {
  terms: {
    propertyTypeSearch_id: number[];
  };
};

export const createPropertyTypeFilterTerms = (
  items: PropertyType.Filter[]
): PropertyFilterTerms[] => {
  const includes = items.reduce(
    (include, item) =>
      item.allPropertySubTypes
        ? [...include, item.propertyTypeId]
        : [...include, ...item.propertySubTypeIds],
    []
  );

  return [
    {
      terms: {
        propertyTypeSearch_id: includes,
      },
    },
  ];
};

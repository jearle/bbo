
interface PropertyType {
  "TrendtrackerData_PropertyTypes_id": number,
  "box3Value": string
  "box3": string
  "display_fg": boolean
  "indent": number
  "propertyType_id": number
  "propertySubType_id": number
  "propertyFeature_id": number
  "PropertySubTypeCategory_id": number
  "definition": string
  "sortOrder": number
  "hotelRating_id": number
  "propertyType_tx": string
}

interface PropertyTypeParent extends PropertyType {
  id: string,
  value: string
  label: string
  options: PropertyType[]
}

type PropertyTypeMenu = PropertyTypeParent[]

export const createPropertyMenu = (flatPropertyArray: PropertyType[]): PropertyTypeMenu => {
  let propertyTypeParents: PropertyTypeParent[] = flatPropertyArray.filter((item) => (item.indent === 0)).map((item) => ({
    ...item,
    label: item.box3,
    id: `${item.propertyType_id}`,
    value: `${item.propertyType_id}`,
    options: []
  }))
  const propertyOnlySubTypes = flatPropertyArray.filter((item) => (item.propertyFeature_id === null ) && (item.PropertySubTypeCategory_id === null) && (item.propertyFeature_id === null) && (item.propertySubType_id !== null));
  propertyOnlySubTypes.forEach((item) => {
    propertyTypeParents = propertyTypeParents.map((parentItem, i) => {
      if (parentItem.propertyType_id === item.propertyType_id) {
        const parentWithChild = {
          ...parentItem,
          options: [
            ...parentItem.options,
            { ...item,
              label: item.box3,
              id: `${item.propertyType_id}-${item.propertySubType_id}`,
              value: `${item.propertySubType_id}`,
            },
          ]
        };
        return parentWithChild;
      }
      return parentItem;
    })
  });
  return propertyTypeParents
}
import { createPropertyTypeMenu } from './index';
import {
  rawPropertyTypes,
  propertyTypeWithNoChildren,
  propertyTypeWithChildren,
} from './mock-data';

describe('propertyTypeMenuBuilder', () => {
  test('propertyTypeMenuBuilder build a menu from raw propertyType data', () => {
    const propertyTypeMenu = createPropertyTypeMenu(rawPropertyTypes);

    expect(propertyTypeMenu[0]).toStrictEqual(propertyTypeWithNoChildren);
    expect(propertyTypeMenu[2]).toStrictEqual(propertyTypeWithChildren);
  });
});

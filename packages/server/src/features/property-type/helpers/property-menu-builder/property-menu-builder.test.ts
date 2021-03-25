import { createPropertyTypeMenu } from './index';
import {
  rawPropertyTypes,
  propertyTypeWithNoChildren,
  propertyTypeWithChildren,
} from './mock-data';

describe('propertyTypeMenuBuilder', () => {
  test('propertyTypeMenuBuilder build a menu from raw propertyType data', () => {
    const createPropertyMenuResult = createPropertyTypeMenu(rawPropertyTypes);
    expect(createPropertyMenuResult[0]).toStrictEqual(
      propertyTypeWithNoChildren
    );
    expect(createPropertyMenuResult[2]).toStrictEqual(propertyTypeWithChildren);
  });
});

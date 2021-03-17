import { createPropertyTypeMenu } from './index';
import {
  rawPropertyTypes,
  propertyTypeWithNoChildren,
  propertyTypeWithChildren,
} from './mock-data';

describe('propertyMenuBuilder', () => {
  test('propertyBuilder', () => {
    const createPropertyMenuResult = createPropertyTypeMenu(rawPropertyTypes);
    expect(createPropertyMenuResult[0]).toStrictEqual(
      propertyTypeWithNoChildren
    );
    expect(createPropertyMenuResult[2]).toStrictEqual(propertyTypeWithChildren);
  });
});

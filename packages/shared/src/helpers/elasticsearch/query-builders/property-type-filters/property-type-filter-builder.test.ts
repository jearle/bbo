import * as PropertyType from '../../../types/property-type';
import { createPropertyTypeFilterTerms } from './index';

describe('property-type-filter-builder', () => {
  it('creates a single filter', () => {
    const filter: PropertyType.Filter = {
      propertyTypeId: 96,
      allPropertySubTypes: true,
      propertySubTypeIds: [102, 107],
    };
    const expectedResult = {
      terms: {
        propertyTypeSearch_id: [96],
      },
    };
    const result = createPropertyTypeFilterTerms([filter]);
    expect(result.length).toBe(1);
    expect(result[0]).toEqual(expectedResult);
  });

  it('creates a single filter for subtype', () => {
    const filter: PropertyType.Filter = {
      propertyTypeId: 96,
      allPropertySubTypes: false,
      propertySubTypeIds: [102],
    };
    const expectedResult = {
      terms: {
        propertyTypeSearch_id: [102],
      },
    };
    const result = createPropertyTypeFilterTerms([filter]);
    expect(result.length).toBe(1);
    expect(result[0]).toEqual(expectedResult);
  });
});

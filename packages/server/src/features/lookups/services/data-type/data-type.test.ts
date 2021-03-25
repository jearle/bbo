import { createDataTypeService } from '.';

describe(`dataTypeService`, () => {
  test(`getDataTypes`, () => {
    const dataTypeService = createDataTypeService();

    expect(
      Array.isArray(dataTypeService.getDataTypes({ propertyType: `apartment` }))
    ).toBe(true);
  });
});

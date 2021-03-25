import { createDataTypeService } from '.';

const UNITS_AND_FEET = `apartment`;
const UNITS_ONLY = `commericial`;
const FEET_ONLY = `hotel`;

describe(`dataTypeService`, () => {
  test(`getDataTypes units and feet`, () => {
    const dataTypeService = createDataTypeService();
    const dataTypes = dataTypeService.getDataTypes({
      propertyType: UNITS_AND_FEET,
    });

    expect(Array.isArray(dataTypes)).toBe(true);
  });

  test(`getDataTypes units`, () => {
    const dataTypeService = createDataTypeService();
    const dataTypes = dataTypeService.getDataTypes({
      propertyType: UNITS_ONLY,
    });

    expect(Array.isArray(dataTypes)).toBe(true);
  });

  test(`getDataTypes feet`, () => {
    const dataTypeService = createDataTypeService();
    const dataTypes = dataTypeService.getDataTypes({
      propertyType: FEET_ONLY,
    });

    expect(Array.isArray(dataTypes)).toBe(true);
  });

  test(`getDataTypes unknown`, () => {
    const dataTypeService = createDataTypeService();

    expect(() =>
      dataTypeService.getDataTypes({
        propertyType: `unknown`,
      })
    ).toThrow();
  });
});

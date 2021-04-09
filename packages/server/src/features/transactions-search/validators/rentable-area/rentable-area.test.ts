import { RentableArea, rentableAreas } from 'shared/dist/helpers/types/rentable-area';
import {rentableAreaValidator} from "./index";

describe(`rentableAreaValidator`, () => {
  rentableAreas.forEach((rentableArea: RentableArea) => {
    it(`should return true for rentableArea ${rentableArea}`, async () => {
      const result = await rentableAreaValidator({
        aggregationType: 'AREA',
        rentableArea
      });
      expect(result).toBe(true);
    });
    it(`should return true for lower case rentableArea ${rentableArea.toLowerCase()}`, async () => {
      const result = await rentableAreaValidator({
        aggregationType: 'AREA',
        rentableArea: rentableArea.toLowerCase(),
      });
      expect(result).toBe(true);
    });
  });

  it(`should reject with an error message for missing required rentableArea`, () => {
    expect(rentableAreaValidator({ aggregationType: 'AREA' })).rejects.toEqual(
      `Must supply rentableArea for aggregation type: AREA`
    );
  });

  it(`should reject with an error message true for unsupported rentableArea`, () => {
    expect(rentableAreaValidator({ aggregationType: 'AREA', rentableArea: 'DUNAM' })).rejects.toEqual(
      `Rentable Area: DUNAM is not supported`
    );
  });
})

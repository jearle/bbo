import { createRentableAreaService } from "./";

describe(`rentableAreaService`, () => {
  test(`getRentableAreas`, () => {
    const rentableAreaService = createRentableAreaService();
    const result = rentableAreaService.getRentableAreas();

    expect(result).toStrictEqual(['SQFT', 'SQMT'])
  })
});

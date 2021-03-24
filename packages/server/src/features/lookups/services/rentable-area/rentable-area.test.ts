import {createRentableAreaService} from "./";

describe(`rentableAreaService`, () => {
  test(`getRentableAreas`, () => {
    const rentableAreaService = createRentableAreaService();
    const rentableAreas = rentableAreaService.getRentableAreas();

    expect(rentableAreas).toBe([
      'SQFT',
      'SQMT'
    ])
  })
});

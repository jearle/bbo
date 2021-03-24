import { rentableAreas } from "shared/dist/helpers/types/rentable-area";
import { createRentableAreaService } from "./";

describe(`rentableAreaService`, () => {
  test(`getRentableAreas`, () => {
    const rentableAreaService = createRentableAreaService();
    const result = rentableAreaService.getRentableAreas();

    expect(result).toBe(rentableAreas)
  })
});

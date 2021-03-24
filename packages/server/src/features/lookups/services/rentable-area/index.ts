import {rentableAreas} from "shared/dist/helpers/types/rentable-area";

const rentableAreaService = () => ({
  getRentableAreas: () => {
    return rentableAreas;
  }
});
export type RentableAreaService = ReturnType<typeof rentableAreaService>;

export const createRentableAreaService = (): RentableAreaService => {
  return rentableAreaService();
}


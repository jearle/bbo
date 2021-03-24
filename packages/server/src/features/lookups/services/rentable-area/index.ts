
const rentableAreaService = () => ({
  getRentableAreas: () => ['SQFT', 'SQMT']
});
export type RentableAreaService = ReturnType<typeof rentableAreaService>;

export const createRentableAreaService = (): RentableAreaService => {
  return rentableAreaService();
}


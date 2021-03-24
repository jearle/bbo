export const rentableAreas = ['SQFT', 'SQMT'] as const;
export type RentableArea = typeof rentableAreas[number];
export const isValidRentableArea = (value) =>
  rentableAreas.includes(value.toUpperCase());

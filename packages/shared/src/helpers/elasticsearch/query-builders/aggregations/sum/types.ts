export type SumType =
  | 'PRICE'
  | 'PROPERTY'
  | 'UNITS'
  | 'AREA'
  | 'CAPRATE'
  | 'PPU_PRICE'
  | 'PPU_UNITS'
  | 'PPA_PRICE'
  | 'PPA_SQFT';

export const rentableAreaSumTypes: SumType[] = [
  'AREA',
  'PPA_SQFT',
];

export const fooooYOU = (st: SumType): boolean => {
  switch (st) {
    case "AREA":
    case "PPA_SQFT":
      return true
    default:
      return false;
  }
}

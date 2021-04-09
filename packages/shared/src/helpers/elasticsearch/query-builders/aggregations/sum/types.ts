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

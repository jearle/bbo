import { isValidRentableArea } from 'shared/dist/helpers/types/rentable-area';

type AggregationInput = {
  readonly aggregationType: string;
  readonly rentableArea?: string;
};

const RENTABLE_AREA_REQUIRED_AGGREGATION_TYPES = [`AREA`, `PPA`];

const missingRentableAreaError = (aggregationType: string): string => {
  return `Must supply rentableArea for aggregation type: ${aggregationType}`;
}

const unsupportedRentableAreaError = (rentableArea: string): string => {
  return `Rentable Area: ${rentableArea} is not supported`;
}

export const rentableAreaValidator = ({
  aggregationType,
  rentableArea
}: AggregationInput): Promise<boolean> => {
  const hasRentableAreaRequirement = RENTABLE_AREA_REQUIRED_AGGREGATION_TYPES.includes(
    aggregationType?.toString().toUpperCase()
  );

  if (!hasRentableAreaRequirement) return Promise.resolve(true);

  if (!rentableArea) return Promise.reject(missingRentableAreaError(aggregationType));

  if (!isValidRentableArea(rentableArea))
    return Promise.reject(unsupportedRentableAreaError(rentableArea));

  return Promise.resolve(true);
}

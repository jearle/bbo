import { isValidRentableArea } from 'shared/dist/helpers/types/rentable-area';

type AggregationInput = {
  readonly aggregationType: string;
  readonly rentableArea?: string;
};


export const rentableAreaValidator = ({
  aggregationType,
  rentableArea
}: AggregationInput): Promise<boolean> => {
  switch(aggregationType?.toString().toUpperCase()) {
    case 'SQFT':
    case 'PPSF':
      if (!rentableArea) {
        return Promise.reject(`Must supply rentableArea for aggregation type: ${aggregationType}`);
      }
      if (!isValidRentableArea(rentableArea)) {
        return Promise.reject(`Rentable Area: ${rentableArea} is not supported`)
      }
      return Promise.resolve(true);
    default:
      return Promise.resolve(true)
  }
}

import { FlatGeographies, GeographyMenu } from '../types';
import { mapFlatGeographies } from './REFACTOR/step1';
import { buildGeographyOptions } from './REFACTOR/step2';

type ToGeographyMenuInput = {
  readonly flatGeographies: FlatGeographies;
};

export const toGeographyMenu = ({
  flatGeographies,
}: ToGeographyMenuInput): GeographyMenu => {
  const mappedFlatGeographies = mapFlatGeographies(flatGeographies);
  const geographyMenu = (buildGeographyOptions(
    mappedFlatGeographies
  ) as unknown) as GeographyMenu;

  return geographyMenu;
};

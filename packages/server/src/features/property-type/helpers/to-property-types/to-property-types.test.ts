import { toPropertyTypes } from '.';

import { rawOfficePropertyTypes } from './stubs/raw-office-property-types';
import { officePropertyTypes } from './stubs/office-property-types';

import { RawPropertyType } from '../../types';

test(`toPropertyTypes`, () => {
  const rawPropertyTypes = (rawOfficePropertyTypes as unknown) as RawPropertyType[];
  const propertyTypes = toPropertyTypes({ rawPropertyTypes });

  expect(propertyTypes).toStrictEqual(officePropertyTypes);
});

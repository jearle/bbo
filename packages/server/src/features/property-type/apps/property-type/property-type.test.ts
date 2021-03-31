import { fetchJSONOnRandomPort } from 'shared/dist/helpers/express/listen-fetch';

import { createMSSQLProvider } from '../../../../providers/mssql';
import {
  createPropertyTypeService,
  PropertyTypeService,
} from '../../services/property-type';
import { createApp } from './';
import { createRedisProvider } from '../../../../providers/redis';

const { ANALYTICSDATA_MSSQL_URI, REDIS_URI } = process.env;

describe('property type app', () => {
  const fetchPropertyTypes = async ({
    propertyTypeService: propertyTypeServiceOverride = null,
  } = {}) => {
    const mssqlProvider = await createMSSQLProvider({
      uri: ANALYTICSDATA_MSSQL_URI,
    });
    const redisProvider = await createRedisProvider({ uri: REDIS_URI });
    const propertyTypeService =
      propertyTypeServiceOverride !== null
        ? propertyTypeServiceOverride
        : await createPropertyTypeService({
            mssqlProvider,
            redisProvider,
          });

    const app = createApp({ propertyTypeService });

    const response = await fetchJSONOnRandomPort(app, {
      path: `/property-type`,
    });

    return response;
  };

  test(`/property-type, returns propertyType without children`, async () => {
    const { data } = await fetchPropertyTypes();

    expect(data.length).toBeGreaterThan(0);
  });

  test(`/property-type, returns proper error payload`, async () => {
    const errorMessage = `foobar`;

    const propertyTypeService = ({
      fetchPropertyTypes() {
        throw new Error(errorMessage);
      },
    } as unknown) as PropertyTypeService;

    const { error } = await fetchPropertyTypes({ propertyTypeService });

    expect(error).toBe(errorMessage);
  });
});

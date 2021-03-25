import * as express from 'express';
import { fetchJSONOnRandomPort } from 'shared/dist/helpers/express/listen-fetch';

import { createMSSQLProvider } from '../../../../providers/mssql';
import { createPropertyTypeService } from '../../services/property-type';
import { createApp } from './';
import { createRedisProvider } from '../../../../providers/redis';

const { ANALYTICSDATA_MSSQL_URI, REDIS_URI } = process.env;

describe('property type app', () => {
  let app = null;
  let propertyTypeService = null;
  let propertyTypeApp = null;

  beforeEach(async () => {
    const mssqlProvider = await createMSSQLProvider({
      uri: ANALYTICSDATA_MSSQL_URI,
    });
    const redisProvider = await createRedisProvider({ uri: REDIS_URI });
    propertyTypeService = await createPropertyTypeService({
      mssqlProvider,
      redisProvider,
    });
    app = express();
    propertyTypeApp = createApp({ propertyTypeService });
  });

  afterAll(() => {
    propertyTypeService.close();
  });

  test(`/property-type, returns propertyType without children`, async () => {
    app.use(propertyTypeApp);

    const { data } = await fetchJSONOnRandomPort(app, {
      path: `/property-type`,
    });

    expect(data.length).toBeGreaterThan(0);
  });
});

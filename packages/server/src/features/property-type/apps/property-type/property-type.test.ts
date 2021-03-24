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
    propertyTypeService = await createPropertyTypeService({ mssqlProvider, redisProvider });
    app = express();
    propertyTypeApp = createApp({ propertyTypeService });
  });

  afterAll(() => {
    propertyTypeService.close();
  });

  test(`/property-type, returns propertyType without children`, async () => {
    const expectedPropertyTypes = {
      TrendtrackerData_PropertyTypes_id: 1,
      box3Value: 'ALL',
      box3: 'All Property Types',
      display_fg: true,
      indent: 0,
      propertyType_id: 0,
      propertySubType_id: null,
      propertyFeature_id: null,
      PropertySubTypeCategory_id: null,
      definition:
        'Office, Industrial, Retail, Apartment, Hotel and Dev Site properties',
      sortOrder: 1,
      hotelRating_id: null,
      propertyType_tx: 'All Property Types',
      label: 'All Property Types',
      id: '0',
      value: '0',
      options: [],
    };
    app.use(propertyTypeApp);
    const propertyTypeResponse = await fetchJSONOnRandomPort(app, {
      path: `/property-type`,
    });
    expect(Array.isArray(propertyTypeResponse)).toBe(true);
    expect(propertyTypeResponse[0]).toStrictEqual(expectedPropertyTypes);
  });
});

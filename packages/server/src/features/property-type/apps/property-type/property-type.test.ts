import * as express from 'express';
import { fetchJSONOnRandomPort } from 'shared/dist/helpers/express/listen-fetch';

import { createMSSQLProvider } from '../../../../providers/mssql';
import { createPropertyTypeService } from '../../services/property-type';
import { createApp } from './';

const { ANALYTICSDATA_MSSQL_URI } = process.env;

describe('property type app', () => {
  let app = null;
  let propertyTypeService = null;
  let propertyTypeApp = null;

  beforeEach(async () => {
    const mssqlProvider = await createMSSQLProvider({
      uri: ANALYTICSDATA_MSSQL_URI,
    });
    propertyTypeService = await createPropertyTypeService({ mssqlProvider });
    app = express();
    propertyTypeApp = createApp({ propertyTypeService });
  });

  afterAll(() => {
    propertyTypeService.close();
  });

  test(`/property-type`, async () => {
    app.use(propertyTypeApp);

    const json = await fetchJSONOnRandomPort(app, { path: `/property-type` });

    expect(Array.isArray(json)).toBe(true);
  });
});

import fetch from 'node-fetch';
import * as express from 'express';
import { portListen } from 'shared/dist/helpers/express/port-listen';

import { createMSSQLProvider } from '../../../../providers/mssql';
import { createPropertyTypeService } from '../../services/property-type';
import { createApp } from './';

const { ANALYTICSDATA_MSSQL_URI } = process.env;

describe('property type app', () => {
  let server = null;
  let app = null;
  let url = null;
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

  afterEach(() => {
    server.close();
  });

  afterAll(() => {
    propertyTypeService.close();
  });

  test(`/property-type`, async () => {
    app.use(propertyTypeApp);
    server = await portListen(app);
    url = `http://localhost:${server.address().port}`;
    const result = await fetch(`${url}/property-type`);
    const data = await result.json();
    expect(Array.isArray(data)).toBe(true);
  });
});

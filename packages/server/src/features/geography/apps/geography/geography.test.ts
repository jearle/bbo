import fetch from 'node-fetch';
import * as express from 'express';
import { portListen } from 'shared/dist/helpers/express/port-listen';

import { createMSSQLProvider } from '../../../../providers/mssql';
import { createGeographyService } from '../../services/geography';
import { createApp } from './';

const { ANALYTICSDATA_MSSQL_URI } = process.env;

describe('geography app', () => {
  let server = null;
  let app = null;
  let url = null;
  let geographyService = null;
  let geographyApp = null;

  beforeEach(async () => {
    const mssqlProvider = await createMSSQLProvider({
      uri: ANALYTICSDATA_MSSQL_URI,
    });
    geographyService = await createGeographyService({ mssqlProvider });
    app = express();
    geographyApp = createApp({ geographyService });
  });

  afterEach(() => {
    server.close();
  });

  afterAll(() => {
    geographyService.close();
  });

  test(`/geography`, async () => {
    app.use(geographyApp);
    server = await portListen(app);
    url = `http://localhost:${server.address().port}`;
    const result = await fetch(`${url}/geography`);
    const data = await result.json();
    expect(Array.isArray(data)).toBe(true);
  });
});

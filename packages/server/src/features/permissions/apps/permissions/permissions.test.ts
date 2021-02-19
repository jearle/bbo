import fetch from 'node-fetch';
import * as express from 'express';
import { portListen } from 'shared/dist/helpers/express/port-listen';

import { createMSSQLProvider } from '../../../../providers/mssql';
import { createRedisProvider } from '../../../../providers/redis';
import { createPermissionsService } from '../../services/permissions';
import { createRCAWebAccountsService } from '../../services/rca-web-accounts';

import { createApp } from './';

const { MSSQL_URI, REDIS_URI } = process.env;

describe('permissions app', () => {
  let server = null;
  let app = null;
  let url = null;
  let rcaWebAccountsService = null;
  let permissionsService = null;

  beforeEach(async () => {
    const mssqlProvider = await createMSSQLProvider({ uri: MSSQL_URI });
    rcaWebAccountsService = await createRCAWebAccountsService({
      mssqlProvider,
    });
    const redisProvider = await createRedisProvider({ uri: REDIS_URI });
    permissionsService = await createPermissionsService({
      redisProvider,
      rcaWebAccountsService,
    });
    app = express();
    app.use(createApp({ permissionsService }));
  });

  afterEach(() => {
    server.close();
  });

  afterAll(async () => {
    await permissionsService.close();
  });

  test(`/refresh`, async () => {
    server = await portListen(app);
    url = `http://localhost:${server.address().port}`;
    const result = await fetch(`${url}/refresh?userId=130435`);
    expect(result.status).toBe(204);
  });
});

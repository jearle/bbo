import * as express from 'express';
import { fetchResponseOnRandomPort } from 'shared/dist/helpers/express/listen-fetch';

import { createMSSQLProvider } from '../../../../providers/mssql';
import { createRedisProvider } from '../../../../providers/redis';
import { createPermissionsService } from '../../services/permissions';
import { createRCAWebAccountsService } from '../../services/rca-web-accounts';

import { createApp } from './';

const { MSSQL_URI, REDIS_URI } = process.env;

describe('permissions app', () => {
  let app = null;
  let rcaWebAccountsService = null;
  let permissionsService = null;
  let permissionsApp = null;

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
    app.use(express.json());
    permissionsApp = createApp({ permissionsService });
  });

  afterAll(async () => {
    await permissionsService.close();
  });

  test(`/refresh`, async () => {
    app.use(permissionsApp);
    const response = await fetchResponseOnRandomPort(app, {
      method: 'POST',
      path: '/refresh',
      body: JSON.stringify({ userId: ['130435'] }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(response.status).toBe(204);
  });
});

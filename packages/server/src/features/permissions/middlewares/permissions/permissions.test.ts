import * as express from 'express';
import * as fetch from 'node-fetch';

import { permissionsMiddleware as createPermissionsMiddleware } from '.';

import { portListen } from '../../../../helpers/express/port-listen';

import { createPermissionsService } from '../../services/permissions';
import { createRedisProvider } from '../../providers/redis';
import { createMSSQLProvider } from '../../../../providers/mssql';
import { createRCAWebAccountsService } from '../../services/rca-web-accounts';

const { MSSQL_URI, REDIS_URI } = process.env;

const USERNAME = 'jearle@rcanalytics.com';

describe(`permissions service`, () => {
  let permissionsService = null;
  let app = null;

  beforeAll(async () => {
    const mssqlProvider = await createMSSQLProvider({ uri: MSSQL_URI });
    const redisProvider = createRedisProvider({ uri: REDIS_URI });

    const rcaWebAccountsService = await createRCAWebAccountsService({
      mssqlProvider,
    });

    permissionsService = createPermissionsService({
      redisProvider,
      rcaWebAccountsService,
    });
  });

  beforeEach(() => {
    const permissionsMiddleware = createPermissionsMiddleware({
      permissionsService,
    });

    app = express();
    app.use((req, res, next) => {
      req.jwtPayload = { username: USERNAME };
      next();
    });
    app.use(permissionsMiddleware);
  });

  afterAll(async () => {
    await permissionsService.close();
  });

  test(`permissionModel`, async () => {
    app.get(`/`, (req, res) => {
      const { permissionsModel } = req;

      res.send({ permissionsModel });
    });

    const server = await portListen(app);
    const { port } = server.address();

    const response = await fetch(`http://localhost:${port}`);
    const { permissionsModel } = await response.json();
    expect(typeof permissionsModel).toBe(`object`);
    server.close();
  });

  test(`permissionModel`, async () => {
    app.get(`/`, (req, res) => {
      const { permissionsFilter } = req;

      res.send({ permissionsFilter });
    });

    const server = await portListen(app);
    const { port } = server.address();

    const response = await fetch(`http://localhost:${port}`);
    const { permissionsFilter } = await response.json();
    expect(typeof permissionsFilter).toBe(`object`);
    server.close();
  });
});

import * as express from 'express';
import * as fetch from 'node-fetch';

import { permissionsMiddleware as createPermissionsMiddleware } from '.';

import { portListen } from '../../helpers/express/port-listen';

import { createPermissionsService } from '../../services/permissions';
import { createRedisService } from '../../services/redis';
import { createRCAWebService } from '../../services/rca-web';

const { RCA_WEB_URI, REDIS_URI } = process.env;

const USER_ID = 130435;

describe(`permissions service`, () => {
  jest.setTimeout(20000);

  let permissionsService = null;
  let app = null;

  beforeAll(async () => {
    const redisService = createRedisService({ uri: REDIS_URI });
    const rcaWebService = createRCAWebService({ uri: RCA_WEB_URI });

    permissionsService = createPermissionsService({
      redisService,
      rcaWebService,
    });
  });

  beforeEach(() => {
    const permissionsMiddleware = createPermissionsMiddleware({
      permissionsService,
    });

    app = express();
    app.use((req, res, next) => {
      req.userId = USER_ID;
      next();
    });
    app.use(permissionsMiddleware);
  });

  afterAll(async () => {
    await permissionsService.close();
  });

  test(`permissionModel`, async () => {
    app.get(`/`, (req, res) => {
      const { permissionModel } = req;

      res.send({ permissionModel });
    });

    const server = await portListen(app);
    const { port } = server.address();

    const response = await fetch(`http://localhost:${port}`);
    const { permissionModel } = await response.json();
    expect(typeof permissionModel).toBe(`object`);
    server.close();
  });

  test(`permissionModel`, async () => {
    app.get(`/`, (req, res) => {
      const { permissionFilter } = req;

      res.send({ permissionFilter });
    });

    const server = await portListen(app);
    const { port } = server.address();

    const response = await fetch(`http://localhost:${port}`);
    const { permissionFilter } = await response.json();
    expect(typeof permissionFilter).toBe(`object`);
    server.close();
  });
});

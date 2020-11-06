import * as express from 'express';
import * as fetch from 'node-fetch';

import { permissionsMiddleware as createPermissionsMiddleware } from '.';

import { portListen } from '../../helpers/express/port-listen';

import { createPermissionsService } from '../../services/permissions';
import { createRedisService } from '../../services/redis';
import { createRCAWebService } from '../../services/rca-web';

const { RCA_WEB_URI, REDIS_URI } = process.env;

describe(`permissions service`, () => {
  jest.setTimeout(20000);

  let permissionsService = null;
  let permissionsMiddleware = null;

  beforeAll(async () => {
    const redisService = createRedisService({ uri: REDIS_URI });
    const rcaWebService = createRCAWebService({ uri: RCA_WEB_URI });

    permissionsService = createPermissionsService({
      redisService,
      rcaWebService,
    });

    permissionsMiddleware = createPermissionsMiddleware({ permissionsService });
  });

  afterAll(async () => {
    await permissionsService.close();
  });

  test(`fetchPermissionModel`, async () => {
    const app = express();
    app.use((req, res, next) => {
      req.userId = 130436;
      next();
    });
    app.use(permissionsMiddleware);
    app.get(`/`, (req, res) => {
      const { permissionModel } = req;

      res.send({ permissionModel });
    });

    const server = await portListen(app);
    const { port } = server.address();

    const response = await fetch(`http://localhost:${port}`);
    const { permissionModel } = await response.json();
    expect(Array.isArray(permissionModel)).toBe(true);
    server.close();
  });
});

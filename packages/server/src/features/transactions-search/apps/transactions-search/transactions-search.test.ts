import fetch from 'node-fetch';
import * as express from 'express';

import { testHealthcheck } from 'shared/dist/helpers/unit/healthcheck';
import { portListen } from 'shared/dist/helpers/express/port-listen';

import { createApp } from './';

import { createTransactionsSearchService } from '../../services/transactions-search';
import { createElasticsearchProvider } from '../../../../providers/elasticsearch';
import { createMSSQLProvider } from '../../../../providers/mssql';
import { createRCAWebAccountsService } from '../../../permissions/services/rca-web-accounts';
import { createPermissionsService } from '../../../permissions/services/permissions';
import { permissionsMiddleware as createPermissionsMiddleware } from '../../../permissions/middlewares/permissions';
import { createRedisProvider } from '../../../../providers/redis';

const {
  MSSQL_URI,
  REDIS_URI,
  ELASTICSEARCH_NODE,
  ELASTICSEARCH_USERNAME,
  ELASTICSEARCH_PASSWORD,
} = process.env;

describe(`transactions app`, () => {
  let permissionsService = null;
  let permissionsMiddleware = null;
  let server = null;
  let app = null;
  let url = null;
  let transactionsSearchApp = null;

  beforeEach(async () => {
    const elasticsearchProvider = createElasticsearchProvider({
      node: ELASTICSEARCH_NODE,
      username: ELASTICSEARCH_USERNAME,
      password: ELASTICSEARCH_PASSWORD,
    });

    const mssqlProvider = await createMSSQLProvider({ uri: MSSQL_URI });
    const redisProvider = createRedisProvider({ uri: REDIS_URI });
    const rcaWebAccountsService = await createRCAWebAccountsService({
      mssqlProvider,
    });

    permissionsService = createPermissionsService({
      rcaWebAccountsService,
      redisProvider,
    });

    permissionsMiddleware = createPermissionsMiddleware({
      permissionsService,
    });

    const transactionsSearchService = createTransactionsSearchService({
      elasticsearchProvider,
    });

    app = express();
    app.use((req, res, next) => {
      req.jwtPayload = { username: 'jearle@rcanalytics.com' };
      next();
    });
    transactionsSearchApp = createApp({ transactionsSearchService });
  });

  afterEach(() => {
    server.close();
  });

  afterAll(async () => {
    await permissionsService.close();
  });

  test(`/healthcheck`, async () => {
    app.use(transactionsSearchApp);
    server = await portListen(app);
    url = `http://localhost:${server.address().port}`;
    await testHealthcheck(app);
  });

  describe(`/transactions`, () => {
    test(`/transactions`, async () => {
      app.use(transactionsSearchApp);
      server = await portListen(app);
      url = `http://localhost:${server.address().port}`;
      const result = await fetch(`${url}/transactions`);
      const { data } = await result.json();
      expect(Array.isArray(data)).toBe(true);
    });

    test(`/transactions with limit`, async () => {
      app.use(transactionsSearchApp);
      server = await portListen(app);
      url = `http://localhost:${server.address().port}`;
      const result = await fetch(`${url}/transactions?limit=5`);
      const { data } = await result.json();
      expect(data.length).toBe(5);
    });

    // todo: fix permissions
    // test(`/transactions with filter from permissionsMiddleware`, async () => {
    //   app.use(permissionsMiddleware);
    //   app.use(transactionsSearchApp);
    //   server = await portListen(app);
    //   url = `http://localhost:${server.address().port}`;
    //   const result = await fetch(`${url}/transactions`);
    //   const { data } = await result.json();
    //   expect(data.length).toBe(0);
    // });
  });

  describe(`/trends`, () => {
    const atlantaFilter = {
      id: 21,
      type: 6,
      name: 'Atlanta'
    };
    it(`searches trends with a geography filter`, async () => {
      app.use(transactionsSearchApp);
      server = await portListen(app);
      url = `http://localhost:${server.address().port}`;
      const result = await fetch(`${url}/trends`, {
        method: 'POST',
        body: JSON.stringify({
          GeographyFilter: atlantaFilter
        }),
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      });


      const { data } = await result.json();
      expect(Array.isArray(data)).toBe(true);
    });
  });

});

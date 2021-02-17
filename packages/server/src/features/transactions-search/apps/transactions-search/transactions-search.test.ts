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
// import { permissionsMiddleware as createPermissionsMiddleware } from '../../../permissions/middlewares/permissions';
import { createRedisProvider } from '../../../../providers/redis';
import { fetchJSONOnRandomPort } from 'shared/dist/helpers/express/listen-fetch';

const {
  MSSQL_URI,
  REDIS_URI,
  ELASTICSEARCH_NODE,
  ELASTICSEARCH_USERNAME,
  ELASTICSEARCH_PASSWORD,
} = process.env;

describe(`transactions app`, () => {
  let permissionsService = null;
  // let permissionsMiddleware = null;
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

    // permissionsMiddleware = createPermissionsMiddleware({
    //   permissionsService,
    // });

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
      name: 'Atlanta',
    };
    const officeFilter = {
      propertyTypeId: 96,
      allPropertySubTypes: true,
      propertySubTypeIds: [102, 107],
    };

    it(`searches trends with a price aggregation filter`, async () => {
      app.use(transactionsSearchApp);
      const { data } = await fetchJSONOnRandomPort(app, {
        method: 'POST',
        path: `/trends`,
        body: JSON.stringify({
          geographyFilter: atlantaFilter,
          propertyTypeFilter: officeFilter,
          aggregation: { aggregationType: 'price', currency: 'USD' },
        }),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      expect(Array.isArray(data)).toBe(true);
      expect(Number.isInteger(data[0].value)).toBe(true);
      expect(data[0]).toHaveProperty('value');
      expect(data[0]).toHaveProperty('date');
      expect(data.length).toBeGreaterThanOrEqual(1);
    });

    it(`searches trends with a units aggregation filter`, async () => {
      const apartmentFilter = {
        propertyTypeId: 1,
        allPropertySubTypes: true,
      };

      app.use(transactionsSearchApp);
      const { data } = await fetchJSONOnRandomPort(app, {
        method: 'POST',
        path: `/trends`,
        body: JSON.stringify({
          geographyFilter: atlantaFilter,
          propertyTypeFilter: apartmentFilter,
          aggregation: { aggregationType: 'units' },
        }),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      expect(Array.isArray(data)).toBe(true);
      expect(Number.isInteger(data[0].value)).toBe(true);
      expect(data[0]).toHaveProperty('date');
      expect(data.length).toBeGreaterThanOrEqual(1);
    });

    it(`searches trends with a sqft aggregation filter`, async () => {
      const officeFilter = {
        propertyTypeId: 96,
        allPropertySubTypes: true,
      };

      app.use(transactionsSearchApp);
      const { data } = await fetchJSONOnRandomPort(app, {
        method: 'POST',
        path: `/trends`,
        body: JSON.stringify({
          geographyFilter: atlantaFilter,
          propertyTypeFilter: officeFilter,
          aggregation: { aggregationType: 'sqft' },
        }),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      expect(Array.isArray(data)).toBe(true);
      expect(Number.isInteger(data[0].value)).toBe(true);
      expect(data[0]).toHaveProperty('date');
      expect(data.length).toBeGreaterThanOrEqual(1);
    });

    it(`fails without a geography`, async () => {
      app.use(transactionsSearchApp);
      server = await portListen(app);
      url = `http://localhost:${server.address().port}`;
      const result = await fetch(`${url}/trends?limit=4`, {
        method: 'POST',
        body: JSON.stringify({
          geographyFilter: null,
          propertyTypeFilter: officeFilter,
        }),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      const status = await result.status;
      expect(status).toBe(500);
    });

    it(`fails without a property type`, async () => {
      app.use(transactionsSearchApp);
      server = await portListen(app);
      url = `http://localhost:${server.address().port}`;
      const result = await fetch(`${url}/trends?limit=4`, {
        method: 'POST',
        body: JSON.stringify({
          geographyFilter: atlantaFilter,
          propertyTypeFilter: null,
        }),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      const status = await result.status;
      expect(status).toBe(500);
    });

    it(`returns es index, request and response when debug flag is set`, async () => {
      app.use(transactionsSearchApp);
      const { data, index, request, response } = await fetchJSONOnRandomPort(
        app,
        {
          method: 'POST',
          path: `/trends?debug=true`,
          body: JSON.stringify({
            geographyFilter: atlantaFilter,
            propertyTypeFilter: officeFilter,
            aggregation: { aggregationType: 'price', currency: 'USD' },
          }),
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      expect(Array.isArray(data)).toBe(true);
      expect(Number.isInteger(data[0].value)).toBe(true);
      expect(data[0]).toHaveProperty('value');
      expect(data[0]).toHaveProperty('date');
      expect(data.length).toBeGreaterThanOrEqual(1);
      expect(index).toEqual(expect.stringContaining('multi_pst'));
      expect(request).toHaveProperty('query');
      expect(response).toHaveProperty('hits');
    });
  });
});

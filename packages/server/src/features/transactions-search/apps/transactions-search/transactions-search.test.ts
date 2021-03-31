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
import { createPropertyTypeService } from '../../../property-type/services/property-type';
import { permissionsMiddleware as createPermissionsMiddleware } from '../../../permissions/middlewares/permissions';
import { createRedisProvider } from '../../../../providers/redis';
import {
  fetchJSONOnRandomPort,
  fetchResponseOnRandomPort,
} from 'shared/dist/helpers/express/listen-fetch';
import { currencies, Currency } from 'shared/dist/helpers/types/currency';

const {
  MSSQL_URI,
  REDIS_URI,
  ELASTICSEARCH_NODE,
  ELASTICSEARCH_USERNAME,
  ELASTICSEARCH_PASSWORD,
  TRANSACTIONS_INDEX,
} = process.env;

describe(`transactions app`, () => {
  // let permissionsService = null;
  // let permissionsMiddleware = null;
  // let server = null;
  // let app = null;
  // let url = null;
  let transactionsSearchApp = null;

  beforeAll(async () => {
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

    const propertyTypeService = await createPropertyTypeService({
      mssqlProvider,
      redisProvider,
    });

    const permissionsService = createPermissionsService({
      rcaWebAccountsService,
      redisProvider,
    });

    const permissionsMiddleware = createPermissionsMiddleware({
      permissionsService,
    });

    const transactionsSearchService = createTransactionsSearchService({
      elasticsearchProvider,
    });

    const app = express();
    app.use(express.json());
    app.use((req, res, next) => {
      req.jwtPayload = { username: 'jearle@rcanalytics.com' };
      next();
    });
    transactionsSearchApp = createApp({
      transactionsSearchService,
      propertyTypeService,
    });
  });

  describe(`transactions-search app`, () => {
    test(`foo`, () => {
      console.log(`foo`);
    });
  });

  // afterAll(async () => {
  //   await permissionsService.close();
  // });

  // test(`/healthcheck`, async () => {
  //   app.use(transactionsSearchApp);
  //   server = await portListen(app);
  //   url = `http://localhost:${server.address().port}`;
  //   await testHealthcheck(app);
  // });

  // describe(`/transactions`, () => {
  //   test(`/transactions`, async () => {
  //     app.use(transactionsSearchApp);
  //     server = await portListen(app);
  //     url = `http://localhost:${server.address().port}`;
  //     const result = await fetch(`${url}/transactions`);
  //     const { data } = await result.json();
  //     expect(Array.isArray(data)).toBe(true);
  //   });

  //   test(`/transactions with limit`, async () => {
  //     app.use(transactionsSearchApp);
  //     server = await portListen(app);
  //     url = `http://localhost:${server.address().port}`;
  //     const result = await fetch(`${url}/transactions?limit=5`);
  //     const { data } = await result.json();
  //     expect(data.length).toBe(5);
  //   });

  //   test(`/transactions with filter from permissionsMiddleware`, async () => {
  //     app.use(permissionsMiddleware);
  //     app.use(transactionsSearchApp);
  //     server = await portListen(app);
  //     url = `http://localhost:${server.address().port}`;
  //     const result = await fetch(`${url}/transactions`);
  //     const { data } = await result.json();
  //     expect(data.length).toBe(10);
  //   });
  // });

  // describe(`/trends`, () => {
  //   const geographyFilter = {
  //     id: 21,
  //     type: 6,
  //     name: 'Atlanta',
  //   };
  //   const propertyType = { slug: `apartment` };
  //   const aggregation = { aggregationType: `price`, currency: `USD` };

  //   const createTrendSearchBody = (overrides = {}) => {
  //     const body = {
  //       geographyFilter,
  //       propertyType,
  //       aggregation,
  //       ...overrides,
  //     };

  //     return JSON.stringify(body);
  //   };

  //   currencies.forEach((currency: Currency) => {
  //     describe(`currency ${currency}`, () => {
  //       it(`searches trends with a price aggregation filter, ATL, apt, qtr, qtr totals, TT match`, async () => {
  //         app.use(transactionsSearchApp);

  //         const body = createTrendSearchBody({
  //           aggregation: { aggregationType: 'price', currency },
  //         });

  //         const { data } = await fetchJSONOnRandomPort(app, {
  //           method: 'POST',
  //           path: `/trends`,
  //           body,
  //         });

  //         expect(Array.isArray(data)).toBe(true);
  //         expect(typeof data[0].value).toBe('number');
  //         expect(data[0]).toHaveProperty('value');
  //         expect(data[0]).toHaveProperty('date');
  //         expect(data.length).toBeGreaterThanOrEqual(1);
  //       });
  //     });
  //   });

  //   it(`searches trends with a units aggregation filter, ATL, apt, qtr, qtr totals, TT match`, async () => {
  //     app.use(transactionsSearchApp);

  //     const body = createTrendSearchBody({
  //       aggregation: { aggregationType: 'units' },
  //     });

  //     const { data } = await fetchJSONOnRandomPort(app, {
  //       method: 'POST',
  //       path: `/trends`,
  //       body,
  //     });

  //     expect(Array.isArray(data)).toBe(true);
  //     expect(Number.isInteger(data[0].value)).toBe(true);
  //     expect(data[0]).toHaveProperty('date');
  //     expect(data.length).toBeGreaterThanOrEqual(1);
  //   });

  //   it(`searches trends with a sqft aggregation filter, ATL, office, qtr, qtr, TT match`, async () => {
  //     const body = createTrendSearchBody({
  //       propertyType: {
  //         slug: `office`,
  //       },
  //     });

  //     app.use(transactionsSearchApp);
  //     const { data } = await fetchJSONOnRandomPort(app, {
  //       method: 'POST',
  //       path: `/trends`,
  //       body,
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Accept: 'application/json',
  //       },
  //     });
  //     expect(Array.isArray(data)).toBe(true);
  //     expect(Number.isInteger(data[0].value)).toBe(true);
  //     expect(data[0]).toHaveProperty('date');
  //     expect(data.length).toBeGreaterThanOrEqual(1);
  //   });

  //   it(`searches trends with a number of properties aggregation filter, ATL, apt, qtr, qtr totals, TT match`, async () => {
  //     app.use(transactionsSearchApp);
  //     const body = createTrendSearchBody({
  //       aggregation: { aggregationType: 'PROPERTY' },
  //     });

  //     const { data } = await fetchJSONOnRandomPort(app, {
  //       method: 'POST',
  //       path: `/trends`,
  //       body,
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Accept: 'application/json',
  //       },
  //     });
  //     expect(Array.isArray(data)).toBe(true);
  //     expect(Number.isInteger(data[0].value)).toBe(true);
  //     expect(data[0]).toHaveProperty('date');
  //     expect(data.length).toBeGreaterThanOrEqual(1);
  //   });

  //   // exact match for all dates, execpt for 2017-09-30, 0.05818639269896916 to TT value of 0,058037676
  //   it(`searches trends with a CAPRATE metric aggregation, ATL, apt, qtr, qtr totals, TT match`, async () => {
  //     app.use(transactionsSearchApp);
  //     const body = createTrendSearchBody({
  //       aggregation: { aggregationType: 'CAPRATE' },
  //     });

  //     const { data } = await fetchJSONOnRandomPort(app, {
  //       method: 'POST',
  //       path: `/trends`,
  //       body,
  //     });
  //     expect(Array.isArray(data)).toBe(true);
  //     expect(data[0]).toHaveProperty('date');
  //     expect(data[0]).toHaveProperty('value');
  //     expect(data.length).toBeGreaterThanOrEqual(1);
  //   });

  // it(`searches trends with a PPU metric aggregation, ATL, apt, qtr, qtr totals, TT match`, async () => {
  //   app.use(transactionsSearchApp);

  //   const body = createTrendSearchBody({
  //     aggregation: { aggregationType: 'PPU', currency: 'USD' },
  //   });

  //   const { data } = await fetchJSONOnRandomPort(app, {
  //     method: 'POST',
  //     path: `/trends`,
  //     body,
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Accept: 'application/json',
  //     },
  //   });
  //   expect(Array.isArray(data)).toBe(true);
  //   expect(data[0]).toHaveProperty('date');
  //   expect(data[0]).toHaveProperty('value');
  //   expect(data.length).toBeGreaterThanOrEqual(1);
  // });

  // it(`searches trends with a PPSF metric aggregation, ATL, off, qtr, qtr totals, TT match`, async () => {
  //   app.use(transactionsSearchApp);
  //   const body = createTrendSearchBody({
  //     propertyType: { slug: `office` },
  //     aggregation: { aggregationType: 'PPSF', currency: 'USD' },
  //   });

  //   const { data } = await fetchJSONOnRandomPort(app, {
  //     method: 'POST',
  //     path: `/trends`,
  //     body,
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Accept: 'application/json',
  //     },
  //   });
  //   expect(Array.isArray(data)).toBe(true);
  //   expect(data[0]).toHaveProperty('date');
  //   expect(data[0]).toHaveProperty('value');
  //   expect(data.length).toBeGreaterThanOrEqual(1);
  // });

  // it(`searches trends with a PPSM metric aggregation, ATL, off, qtr, qtr totals, TT match`, async () => {
  //   app.use(transactionsSearchApp);

  //   const body = createTrendSearchBody({
  //     propertyType: { slug: `apartment` },
  //     aggregation: { aggregationType: 'PPSM', currency: 'EUR' },
  //   });

  //   const { data } = await fetchJSONOnRandomPort(app, {
  //     method: 'POST',
  //     path: `/trends`,
  //     body,
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Accept: 'application/json',
  //     },
  //   });

  //   expect(Array.isArray(data)).toBe(true);
  //   expect(data[0]).toHaveProperty('date');
  //   expect(data[0]).toHaveProperty('value');
  //   expect(data.length).toBeGreaterThanOrEqual(1);
  // });

  //   it(`returns a bad request response when missing a required currency for a pricing metric`, async () => {
  //     app.use(transactionsSearchApp);

  //     const body = createTrendSearchBody({
  //       aggregation: { aggregationType: 'price' },
  //     });

  //     const response = await fetchResponseOnRandomPort(app, {
  //       method: 'POST',
  //       path: `/trends`,
  //       body,
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Accept: 'application/json',
  //       },
  //     });

  //     expect(response.status).toBe(400);
  //   });

  //   it(`returns a bad request response for unsupported currency`, async () => {
  //     app.use(transactionsSearchApp);

  //     const body = createTrendSearchBody({
  //       aggregation: { aggregationType: 'price', currency: 'FAKE-CURRENCY' },
  //     });

  //     const response = await fetchResponseOnRandomPort(app, {
  //       method: 'POST',
  //       path: `/trends`,
  //       body,
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Accept: 'application/json',
  //       },
  //     });

  //     expect(response.status).toBe(400);
  //   });

  //   it(`fails without a geography`, async () => {
  //     app.use(transactionsSearchApp);

  //     const body = createTrendSearchBody({
  //       geographyFilter: null,
  //     });

  //     const response = await fetchResponseOnRandomPort(app, {
  //       method: 'POST',
  //       path: `/trends?limit=4`,
  //       body,
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Accept: 'application/json',
  //       },
  //     });

  //     expect(response.status).toBe(400);
  //   });

  //   it(`fails without a property type`, async () => {
  //     app.use(transactionsSearchApp);

  //     const body = createTrendSearchBody({
  //       propertyType: null,
  //     });

  //     const response = await fetchResponseOnRandomPort(app, {
  //       method: 'POST',
  //       path: `/trends?limit=4`,
  //       body,
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Accept: 'application/json',
  //       },
  //     });
  //     expect(response.status).toBe(400);
  //   });

  //   it(`returns es index, request and response when debug flag is set`, async () => {
  //     app.use(transactionsSearchApp);

  //     const body = createTrendSearchBody({
  //       aggregation: { aggregationType: 'price', currency: 'USD' },
  //     });

  //     const { data, index, request, response } = await fetchJSONOnRandomPort(
  //       app,
  //       {
  //         method: 'POST',
  //         path: `/trends?debug=true`,
  //         body,
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Accept: 'application/json',
  //         },
  //       }
  //     );

  //     expect(Array.isArray(data)).toBe(true);
  //     expect(Number.isInteger(data[0].value)).toBe(true);
  //     expect(data[0]).toHaveProperty('value');
  //     expect(data[0]).toHaveProperty('date');
  //     expect(data.length).toBeGreaterThanOrEqual(1);
  //     expect(index).toEqual(TRANSACTIONS_INDEX);
  //     expect(request).toHaveProperty('query');
  //     expect(response).toHaveProperty('hits');
  //   });
  // });
});

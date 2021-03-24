import * as express from 'express';

import { createApp } from './';

import { createTransactionsSearchService } from '../../services/transactions-search';
import { createElasticsearchProvider } from '../../../../providers/elasticsearch';
import { createMSSQLProvider } from '../../../../providers/mssql';
import { createPropertyTypeService } from '../../../property-type/services/property-type';
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
  let app = null;

  beforeAll(async () => {
    const elasticsearchProvider = createElasticsearchProvider({
      node: ELASTICSEARCH_NODE,
      username: ELASTICSEARCH_USERNAME,
      password: ELASTICSEARCH_PASSWORD,
    });

    const mssqlProvider = await createMSSQLProvider({ uri: MSSQL_URI });
    const redisProvider = createRedisProvider({ uri: REDIS_URI });

    const propertyTypeService = await createPropertyTypeService({
      mssqlProvider,
      redisProvider,
    });

    const transactionsSearchService = createTransactionsSearchService({
      elasticsearchProvider,
      propertyTypeService,
    });

    const transactionsSearchApp = createApp({
      transactionsSearchService,
    });

    app = express();
    app.use(express.json());
    app.use((req, res, next) => {
      req.jwtPayload = { username: 'jearle@rcanalytics.com' };
      next();
    });
    app.use(transactionsSearchApp);
  });

  describe(`/transactions`, () => {
    test(`/transactions`, async () => {
      const { data } = await fetchJSONOnRandomPort(app, {
        path: `/transactions`,
      });

      expect(data.length).toBe(10);
    });

    test(`/transactions with limit`, async () => {
      const { data } = await fetchJSONOnRandomPort(app, {
        path: `/transactions`,
        query: `limit=5`,
      });

      expect(data.length).toBe(5);
    });
  });

  describe(`/trends`, () => {
    const geographyFilter = {
      id: 21,
      type: 6,
      name: 'Atlanta',
    };

    const propertyTypes = [`office`];

    const aggregation = { aggregationType: `price`, currency: `USD` };

    test(`/trends`, async () => {
      const body = JSON.stringify({
        geographyFilter,
        propertyTypes,
        aggregation,
      });

      const { data } = await fetchJSONOnRandomPort(app, {
        method: `POST`,
        path: `/trends`,
        body,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      expect(Array.isArray(data)).toBe(true);
      expect(data[0]).toHaveProperty('date');
      expect(data[0]).toHaveProperty('value');
      expect(data.length).toBeGreaterThanOrEqual(1);
    });

    it(`searches trends with a PPA metric aggregation, ATL, off, SQFT, qtr, qtr totals, TT match`, async () => {
      const { data } = await fetchJSONOnRandomPort(app, {
        method: 'POST',
        path: `/trends`,
        body: JSON.stringify({
          geographyFilter,
          propertyTypes,
          aggregation: { aggregationType: 'PPA', currency: 'USD', rentableArea: 'SQFT' },
        }),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      expect(Array.isArray(data)).toBe(true);
      expect(data[0]).toHaveProperty('date');
      expect(data[0]).toHaveProperty('value');
      expect(data.length).toBeGreaterThanOrEqual(1);
    });

    it(`searches trends with a PPA metric aggregation ATL, off, SQMT, qtr, qtr totals, TT match`, async () => {
      const { data } = await fetchJSONOnRandomPort(app, {
        method: 'POST',
        path: `/trends`,
        body: JSON.stringify({
          geographyFilter,
          propertyTypes,
          aggregation: { aggregationType: 'PPA', currency: 'USD', rentableArea: 'SQMT' },
        }),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      expect(data.length).toBeGreaterThan(0);
    });
  });
});

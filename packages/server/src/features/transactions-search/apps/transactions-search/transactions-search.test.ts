import fetch from 'node-fetch';
import { createApp } from './';
import { testHealthcheck } from '../../../../helpers/unit/healthcheck';
import { portListen } from '../../../../helpers/express/port-listen';

import { createTransactionsSearchService } from '../../services/transactions-search';
import { createElasticsearchProvider } from '../../../../providers/elasticsearch';

const {
  ELASTICSEARCH_NODE,
  ELASTICSEARCH_USERNAME,
  ELASTICSEARCH_PASSWORD,
} = process.env;

describe(`transactions app`, () => {
  let server = null;
  let app = null;
  let url = null;

  beforeEach(async () => {
    const elasticsearchProvider = createElasticsearchProvider({
      node: ELASTICSEARCH_NODE,
      username: ELASTICSEARCH_USERNAME,
      password: ELASTICSEARCH_PASSWORD,
    });

    const transactionsSearchService = createTransactionsSearchService({
      elasticsearchProvider,
    });

    app = createApp({ transactionsSearchService });
    server = await portListen(app);
    url = `http://localhost:${server.address().port}`;
  });

  afterEach(() => {
    server.close();
  });

  test(`/healthcheck`, async () => {
    await testHealthcheck(app);
  });

  test(`/transactions`, async () => {
    const result = await fetch(`${url}/transactions`);
    const { data } = await result.json();

    expect(Array.isArray(data)).toBe(true);
  });

  test(`/transactions with limit`, async () => {
    const result = await fetch(`${url}/transactions?limit=5`);
    const { data } = await result.json();

    expect(data.length).toBe(5);
  });
});

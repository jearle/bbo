import fetch from 'node-fetch';
import { createApp } from './';
import { createTransactionsService } from './services/transactions';
import { createElasticsearchClient } from '../../services/elasticsearch';
import { testHealthcheck } from '../../helpers/unit/healthcheck';
import { portListen } from '../../helpers/express/port-listen';
import MockLDClient from '../../services/launchdarkly/launchdarkly.mock';

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
    const transactionsService = createTransactionsService({
      client: createElasticsearchClient({
        node: ELASTICSEARCH_NODE,
        username: ELASTICSEARCH_USERNAME,
        password: ELASTICSEARCH_PASSWORD,
      }),
    });

    const launchDarklyClient = new MockLDClient();

    app = createApp({ transactionsService, launchDarklyClient });
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

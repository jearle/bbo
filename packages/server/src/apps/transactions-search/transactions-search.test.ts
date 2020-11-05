import fetch from 'node-fetch';
import { createApp } from './';
import { createTransactionsService } from './services/transactions';
import { createElasticsearchClient } from '../../services/elasticsearch';
import { testHealthcheck } from '../../helpers/unit/healthcheck';

const {
  ELASTICSEARCH_NODE,
  ELASTICSEARCH_USERNAME,
  ELASTICSEARCH_PASSWORD,
} = process.env;

describe(`transactions app`, () => {
  let app = null;

  beforeEach(() => {
    const transactionsService = createTransactionsService({
      client: createElasticsearchClient({
        node: ELASTICSEARCH_NODE,
        username: ELASTICSEARCH_USERNAME,
        password: ELASTICSEARCH_PASSWORD,
      }),
    });

    app = createApp({ transactionsService });
  });

  test(`/healthcheck`, async () => {
    await testHealthcheck(app);
  });

  test(`/transactions no params`, () => {});
});

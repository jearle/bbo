import { createApp } from './';
import { TransactionsService, createTransactionsService, cleanTransactionSearchParams } from './services/transactions';
import { createElasticsearchClient } from '../../services/elasticsearch';
import { testHealthcheck } from '../../helpers/unit/healthcheck';

const {
  ELASTICSEARCH_NODE,
  ELASTICSEARCH_USERNAME,
  ELASTICSEARCH_PASSWORD,
} = process.env;

const transactionsService = createTransactionsService({
  client: createElasticsearchClient({
    node: ELASTICSEARCH_NODE,
    username: ELASTICSEARCH_USERNAME,
    password: ELASTICSEARCH_PASSWORD,
  }),
});

test(`healthcheck`, async () => {
  await testHealthcheck(createApp({ transactionsService }));
});

test('search transactions', async () => {
  var params = cleanTransactionSearchParams({});
  const result = await transactionsService.search(params);

  expect(result.body.hits.hits.length).toBeGreaterThanOrEqual(1);

})

test('search transactions with limit should not return more than set limit', async () => {
  var params = cleanTransactionSearchParams({limit: 5});
  const result = await transactionsService.search(params);

  expect(result.body.hits.hits.length).toBeLessThanOrEqual(<any>params.limit);

})


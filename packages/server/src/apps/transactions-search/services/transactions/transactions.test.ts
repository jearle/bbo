import { createElasticsearchClient } from '../../../../services/elasticsearch';
import { createTransactionsService, cleanTransactionSearchParams } from '.';

const {
  ELASTICSEARCH_NODE,
  ELASTICSEARCH_USERNAME,
  ELASTICSEARCH_PASSWORD,
} = process.env;

describe(`transactions service`, () => {
  let transactionsService = null;

  beforeEach(() => {
    transactionsService = createTransactionsService({
      client: createElasticsearchClient({
        node: ELASTICSEARCH_NODE,
        username: ELASTICSEARCH_USERNAME,
        password: ELASTICSEARCH_PASSWORD,
      }),
    });
  });

  test(`createTransactionsService`, () => {
    expect.any(transactionsService);
  });

  test('search transactions', async () => {
    const params = cleanTransactionSearchParams({});
    const hits = await transactionsService.search(params);

    expect(hits.length).toBeGreaterThanOrEqual(1);
  });

  test('search transactions with limit should not return more than set limit', async () => {
    const params = cleanTransactionSearchParams({ limit: 5 });
    const hits = await transactionsService.search(params);

    expect(hits.length).toBeLessThanOrEqual(params.limit);
  });
});

import { createTransactionsSearchService, TransactionsSearchService } from '.';
import { createElasticsearchProvider } from '../../../../providers/elasticsearch';

const {
  ELASTICSEARCH_NODE,
  ELASTICSEARCH_USERNAME,
  ELASTICSEARCH_PASSWORD,
} = process.env;

describe(`transactionsSearchService`, () => {
  let transactionsSearchService: TransactionsSearchService;

  beforeAll(() => {
    const elasticsearchProvider = createElasticsearchProvider({
      node: ELASTICSEARCH_NODE,
      username: ELASTICSEARCH_USERNAME,
      password: ELASTICSEARCH_PASSWORD,
    });

    transactionsSearchService = createTransactionsSearchService({
      elasticsearchProvider,
    });
  });

  test(`search`, async () => {
    const result = await transactionsSearchService.searchTransactions();

    expect(result).toHaveLength(10);
  });
});

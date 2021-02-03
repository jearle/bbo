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
    const result = await transactionsSearchService.search();

    expect(result).toHaveLength(10);
  });

  test(`search from page 1`, async () => {
    const result = await transactionsSearchService.search({ page: 1 });

    if (/localhost/.test(ELASTICSEARCH_NODE)) expect(result).toHaveLength(1);
    else expect(result).toHaveLength(10);
  });
});

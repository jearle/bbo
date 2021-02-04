import { createTransactionsSearchService, TransactionsSearchService } from '.';
import { createElasticsearchProvider } from '../../../../providers/elasticsearch';
import { cleanTransactionsSearchQuery } from '../../helpers/clean-transactions-search';

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

  test(`search with query`, async () => {
    const query = cleanTransactionsSearchQuery({ limit: 4 });
    const result = await transactionsSearchService.search({
      esQuery: query
    });

    expect(result).toHaveLength(4);
  });
});

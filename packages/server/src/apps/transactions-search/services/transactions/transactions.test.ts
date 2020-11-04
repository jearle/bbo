import { createElasticsearchClient } from '../../../../services/elasticsearch2';
import { createTransactionsService } from '.';

const {
  ELASTICSEARCH_NODE,
  ELASTICSEARCH_USERNAME,
  ELASTICSEARCH_PASSWORD,
} = process.env;

test(`createTransactionsService`, () => {
  const transactionsService = createTransactionsService({
    client: createElasticsearchClient({
      node: ELASTICSEARCH_NODE,
      username: ELASTICSEARCH_USERNAME,
      password: ELASTICSEARCH_PASSWORD,
    }),
  });

  expect.any(transactionsService);
});

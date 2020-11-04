import { createElasticsearchClient } from './';

const {
  ELASTICSEARCH_NODE,
  ELASTICSEARCH_USERNAME,
  ELASTICSEARCH_PASSWORD,
} = process.env;

test(`createElasticsearchClient`, async () => {
  const client = createElasticsearchClient({
    node: ELASTICSEARCH_NODE,
    username: ELASTICSEARCH_USERNAME,
    password: ELASTICSEARCH_PASSWORD,
  });

  expect.any(client);
});

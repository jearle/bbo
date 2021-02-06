import { createElasticsearchProvider } from '../../../../providers/elasticsearch';
import { createElasticsearchHealthService } from '../../services/elasticsearch';

const {
  ELASTICSEARCH_NODE,
  ELASTICSEARCH_USERNAME,
  ELASTICSEARCH_PASSWORD,
} = process.env;

test('healthy elasticsearch health service', async () => {
  const healthService = await createElasticsearchHealthService({
    elasticsearchProvider: await createElasticsearchProvider({
      node: ELASTICSEARCH_NODE,
      username: ELASTICSEARCH_USERNAME,
      password: ELASTICSEARCH_PASSWORD,
    }),
  });
  const { status } = await healthService.health();
  expect(status).toBe(0);
});

test('unhealthy elasticsearch health service', async () => {
  const healthService = await createElasticsearchHealthService({
    elasticsearchProvider: await createElasticsearchProvider({
      node: 'http://wrong.example.com',
      username: ELASTICSEARCH_USERNAME,
      password: ELASTICSEARCH_PASSWORD,
    }),
  });
  const { status } = await healthService.health();
  expect(status).toBe(1);
});

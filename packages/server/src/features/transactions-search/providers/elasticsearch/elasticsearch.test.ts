import { createElasticsearchProvider, ElasticsearchProvider } from '.';

const {
  ELASTICSEARCH_NODE,
  ELASTICSEARCH_USERNAME,
  ELASTICSEARCH_PASSWORD,
} = process.env;

describe(`elasticsearchProvider`, () => {
  let elasticsearchProvider: ElasticsearchProvider;

  beforeAll(() => {
    elasticsearchProvider = createElasticsearchProvider({
      node: ELASTICSEARCH_NODE,
      username: ELASTICSEARCH_USERNAME,
      password: ELASTICSEARCH_PASSWORD,
    });
  });

  test(`createElasticsearchProvider`, () => {
    const elasticsearchClient = elasticsearchProvider.createClient();

    expect(elasticsearchClient).not.toBeUndefined();

    elasticsearchClient.close();
  });
});

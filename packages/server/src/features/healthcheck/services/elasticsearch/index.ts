import {
  ElasticsearchProvider,
  ElasticsearchClient,
} from '../../../../providers/elasticsearch';

type CreateElasticsearchHealthServiceInputs = {
  elasticsearchProvider: ElasticsearchProvider;
};

type ElasticsearchHealthServiceInputs = {
  elasticsearchClient: ElasticsearchClient;
};

const DEFAULT_FILTER = { match_all: {} };

const elasticsearchHealthService = ({
  elasticsearchClient,
}: ElasticsearchHealthServiceInputs) => ({
  async health() {
    const health = {
      name: 'Elasticsearch',
      status: 0,
      msg: 'ok',
    };

    try {
      const result = await elasticsearchClient.search({
        index: 'test7_multi_pst',
        from: 0,
        size: 1,
        body: {
          query: DEFAULT_FILTER,
        },
      });
      const { hits } = result.body.hits;

      if (hits.length !== 1) {
        health.status = 1;
        health.msg = `${health.name} is unhealty`;
      }

      return health;
    } catch (error) {
      return {
        ...health,
        status: 1,
        msg: `${health.name} threw error: ${error.message}`,
      };
    }
  },
});

export type ElasticsearchHealthService = ReturnType<
  typeof elasticsearchHealthService
>;

export const createElasticsearchHealthService = ({
  elasticsearchProvider,
}: CreateElasticsearchHealthServiceInputs): ElasticsearchHealthService => {
  const elasticsearchClient = elasticsearchProvider.createClient();

  return elasticsearchHealthService({ elasticsearchClient });
};

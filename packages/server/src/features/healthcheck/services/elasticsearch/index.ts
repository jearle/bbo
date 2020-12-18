import {
  ElasticsearchProvider,
  ElasticsearchClient,
} from '../../../../providers/elasticsearch';
import {
  HealthStatus,
  createHealthyStatus,
  createUnhealthyStatus,
} from '../../helpers/health-status';

type CreateElasticsearchHealthServiceInputs = {
  elasticsearchProvider: ElasticsearchProvider;
};

type ElasticsearchHealthServiceInputs = {
  elasticsearchClient: ElasticsearchClient;
};

const DEFAULT_FILTER = { match_all: {} };
const SERVICE_NAME = 'Elasticsearch';

const elasticsearchHealthService = ({
  elasticsearchClient,
}: ElasticsearchHealthServiceInputs) => ({
  async health(): Promise<HealthStatus> {
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
        return createUnhealthyStatus(SERVICE_NAME);
      }

      return createHealthyStatus(SERVICE_NAME);
    } catch (error) {
      return createUnhealthyStatus(SERVICE_NAME);
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

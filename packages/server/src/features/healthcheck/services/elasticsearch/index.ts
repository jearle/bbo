import { ElasticsearchProvider } from '../../../../providers/elasticsearch';
import {
  HealthStatus,
  createHealthyStatus,
  createUnhealthyStatus,
} from '../../helpers/health-status';

type CreateElasticsearchHealthServiceInputs = {
  elasticsearchProvider: ElasticsearchProvider;
};

type ElasticsearchHealthServiceInputs = {
  elasticsearchProvider: ElasticsearchProvider;
};

const DEFAULT_FILTER = { match_all: {} };
const SERVICE_NAME = 'Elasticsearch';

const elasticsearchHealthService = ({
  elasticsearchProvider,
}: ElasticsearchHealthServiceInputs) => ({
  async health(): Promise<HealthStatus> {
    try {
      const client = elasticsearchProvider.createClient();
      await client.search({
        index: 'test7_multi_pst',
        from: 0,
        size: 1,
        body: {
          query: DEFAULT_FILTER,
        },
      });
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
  return elasticsearchHealthService({ elasticsearchProvider });
};

import { Client } from '@elastic/elasticsearch';

type ElasticsearchInputs = {
  readonly username: string;
  readonly password: string;
  readonly node: string;
};

type ElasticsearchProviderInputs = ElasticsearchInputs;

export type ElasticsearchClient = Client;

const elasticSearchProvider = ({
  node,
  username,
  password,
}: ElasticsearchProviderInputs) => ({
  createClient(): ElasticsearchClient {
    const client = new Client({ node, auth: { username, password } });

    return client;
  },
});

export type ElasticsearchProvider = ReturnType<typeof elasticSearchProvider>;

export const createElasticsearchProvider = ({
  node,
  username,
  password,
}: ElasticsearchInputs): ElasticsearchProvider => {
  return elasticSearchProvider({ node, username, password });
};

import { Client } from '@elastic/elasticsearch';

export interface ElasticsearchOptions {
  username: string;
  password: string;
  node: string;
}

export const createElasticsearchClient = ({
  node,
  username,
  password,
}: ElasticsearchOptions) => {
  const client = new Client({ node, auth: { username, password } });

  return client;
};

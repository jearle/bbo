import { Client } from '@elastic/elasticsearch';

interface TransactionsOptions {
  client: Client;
}

export interface TransactionsService {
  search: Function;
}

export const createTransactionsService = ({ client }: TransactionsOptions) => {
  return {
    async search() {
      const result = await client.index({
        index: 'test7_multi_pst',
        body: {
          foo: 'bar',
        },
      });

      return result;
    },
  };
};

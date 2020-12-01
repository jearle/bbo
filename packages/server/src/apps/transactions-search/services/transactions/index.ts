import { Client } from '@elastic/elasticsearch';

interface TransactionsOptions {
  client: Client;
}

export interface TransactionsService {
  search: Function;
}

export interface TransactionSearchParams {
  limit: number;
  filter: any;
}

export const cleanTransactionSearchParams = (searchParams: {
  limit?: number;
  filter?: any;
}): TransactionSearchParams => {
  const { limit = 10, filter = null } = searchParams;

  return { limit: parseInt(limit.toString()), filter };
};

export const createTransactionsService = ({ client }: TransactionsOptions) => {
  return {
    async search(params: TransactionSearchParams) {
      const result = await client.search({
        index: 'test7_multi_pst',
        from: 0,
        size: <any>params.limit,
        body: {
          query: params.filter || {
            match_all: {},
          },
        },
      });

      return result.body.hits.hits.map(({ _source }) => {
        return _source;
      });
    },
  };
};

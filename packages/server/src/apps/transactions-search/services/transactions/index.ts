import { Client } from '@elastic/elasticsearch';

interface TransactionsOptions {
  client: Client;
}

export interface TransactionsService {
  search: Function;
}

export interface TransactionSearchParams {
  limit: Number;
}

export const cleanTransactionSearchParams = (
  searchParams
): TransactionSearchParams => {
  const { limit = 10 } = searchParams;
  
  return { limit: parseInt(limit.toString()) };
};

export const createTransactionsService = ({ client }: TransactionsOptions) => {
  return {
    async search(params:TransactionSearchParams) {
      const result = await client.search({
        index: 'test7_multi_pst',
        from: 0,
        size: <any>params.limit,
        body: {
          query: {
            match_all: {}
          }
        }
      });

      return result;
    },
  };
};

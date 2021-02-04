import { Query as ElasticQuery } from 'shared/dist/helpers/types/elasticsearch';

type CleanTransactionsSearchQueryInputs = {
  readonly page?: number | string;
  readonly limit?: number | string;
};

export const cleanTransactionsSearchQuery = ({
  page: pageInput = 0,
  limit: limitInput = 10,
}: CleanTransactionsSearchQueryInputs = {}): ElasticQuery => {
  const page = parseInt(pageInput.toString());
  const limit = parseInt(limitInput.toString());

  return {
    size: limit,
    from: page * limit,
    query: {
      bool: {
        must: {
          match_all: {}
        }
      }
    }
  };
};

import { ElasticQuery } from 'shared/dist/helpers/types';
import { CreatePermissionsFilterResult } from '../../../permissions/helpers/elasticsearch/permissions-filter';

type CleanTransactionsSearchQueryInputs = {
  readonly page?: number | string;
  readonly limit?: number | string;
  readonly permissionsFilter?: CreatePermissionsFilterResult;
};

export const cleanTransactionsSearchQuery = ({
  page: pageInput = 0,
  limit: limitInput = 10,
  permissionsFilter = null
}: CleanTransactionsSearchQueryInputs = {}): ElasticQuery => {
  const page = parseInt(pageInput.toString());
  const limit = parseInt(limitInput.toString());

  return {
    size: limit,
    from: page * limit,
    query: {
      bool: {
        must: {
          match_all: {},
        },
        filter: {
          bool: {
            must: permissionsFilter
          }
        }
      },
    },
  };
};

type CleanTransactionsSearchQueryInputs = {
  readonly page?: number | string;
  readonly limit?: number | string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly filter?: any;
};

type CleanTransactionsSearchQueryResult = {
  readonly page: number;
  readonly limit: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly filter?: any;
};

export const cleanTransactionsSearchQuery = ({
  page: pageInput = 0,
  limit: limitInput = 10,
  filter,
}: CleanTransactionsSearchQueryInputs = {}): CleanTransactionsSearchQueryResult => {
  const page = parseInt(pageInput.toString());
  const limit = parseInt(limitInput.toString());

  return { page, limit, filter };
};

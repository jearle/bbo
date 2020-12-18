type CleanTransactionsSearchQueryInputs = {
  readonly page?: number | string;
  readonly limit?: number | string;
};

type CleanTransactionsSearchQueryResult = {
  readonly page: number;
  readonly limit: number;
};

export const cleanTransactionsSearchQuery = ({
  page: pageInput = 0,
  limit: limitInput = 10,
}: CleanTransactionsSearchQueryInputs = {}): CleanTransactionsSearchQueryResult => {
  const page = parseInt(pageInput.toString());
  const limit = parseInt(limitInput.toString());

  return { page, limit };
};

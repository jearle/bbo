import { cleanTransactionsSearchQuery } from '.';

test(`cleanTransactionsSearchQuery empty`, () => {
  const { page, limit } = cleanTransactionsSearchQuery();

  expect(page).toBe(0);
  expect(limit).toBe(10);
});

test(`cleanTransactionsSearchQuery limit string`, () => {
  const { page, limit } = cleanTransactionsSearchQuery({
    page: `1`,
    limit: `10`,
  });

  expect(page).toBe(1);
  expect(limit).toBe(10);
});

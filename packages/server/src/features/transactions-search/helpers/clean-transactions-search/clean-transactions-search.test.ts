import { cleanTransactionsSearchQuery } from '.';

test(`cleanTransactionsSearchQuery empty`, () => {
  const { from, size } = cleanTransactionsSearchQuery();

  expect(from).toBe(0);
  expect(size).toBe(10);
});

test(`cleanTransactionsSearchQuery limit string`, () => {
  const { from, size } = cleanTransactionsSearchQuery({
    page: `1`,
    limit: `10`,
  });

  expect(from).toBe(10);
  expect(size).toBe(10);
});

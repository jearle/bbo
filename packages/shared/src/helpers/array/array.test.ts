import { unique } from '.';

test(`unique`, () => {
  const array: number[] = [1, 1];

  expect(unique(array)).toHaveLength(1);
});

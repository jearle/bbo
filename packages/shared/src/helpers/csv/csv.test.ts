import { csvToIntArray } from '.';

describe(`csvToIntArray`, () => {
  test(`csvToIntArray no argument`, () => {
    const array = csvToIntArray();

    expect(array).toHaveLength(0);
  });

  test(`csvToIntArray undefined`, () => {
    const array = csvToIntArray(undefined);

    expect(array).toHaveLength(0);
  });

  test(`csvToIntArray null`, () => {
    const array = csvToIntArray(null);

    expect(array).toHaveLength(0);
  });

  test(`csvToIntArray ''`, () => {
    const array = csvToIntArray('');

    expect(array).toHaveLength(0);
  });

  test(`csvToIntArray '1'`, () => {
    const array = csvToIntArray('1');

    expect(array).toHaveLength(1);
    expect(array[0]).toEqual(1);
  });

  test(`csvToIntArray '1,2'`, () => {
    const array = csvToIntArray('1,2');

    expect(array).toHaveLength(2);
    expect(array).toEqual([1, 2]);
  });
});

import { csvToArray } from '.';

describe(`csvToArray`, () => {
  test(`csvToArray no argument`, () => {
    const array = csvToArray();

    expect(array).toHaveLength(0);
  });

  test(`csvToArray undefined`, () => {
    const array = csvToArray(undefined);

    expect(array).toHaveLength(0);
  });

  test(`csvToArray null`, () => {
    const array = csvToArray(null);

    expect(array).toHaveLength(0);
  });

  test(`csvToArray ''`, () => {
    const array = csvToArray('');

    expect(array).toHaveLength(0);
  });

  test(`csvToArray '1'`, () => {
    const array = csvToArray('1');

    expect(array).toHaveLength(1);
  });

  test(`csvToArray '1,2'`, () => {
    const array = csvToArray('1,2');

    expect(array).toHaveLength(2);
  });
});

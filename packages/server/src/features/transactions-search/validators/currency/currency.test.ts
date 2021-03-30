import { currencyValidator } from './index';
import { currencies, Currency } from 'shared/dist/helpers/types/currency';

describe('currencyValidator()', () => {
  currencies.forEach((currency: Currency) => {
    it(`should return true for currency ${currency}`, async () => {
      const result = await currencyValidator({
        aggregationType: 'PRICE',
        currency,
      });
      expect(result).toBe(true);
    });
    it(`should return true for lower case currency ${currency.toLowerCase()}`, async () => {
      const result = await currencyValidator({
        aggregationType: 'PRICE',
        currency: currency.toLowerCase(),
      });
      expect(result).toBe(true);
    });
  });

  it('should reject with an error message for missing required currency', () => {
    expect(currencyValidator({ aggregationType: 'PRICE' })).rejects.toEqual(
      'Must supply currency for aggregation type: PRICE'
    );
  });

  it(`should reject with an error message true for unsupported currency`, () => {
    expect(
      currencyValidator({ aggregationType: 'PRICE', currency: 'ILS' })
    ).rejects.toEqual('Currency: ILS is not supported');
  });
});

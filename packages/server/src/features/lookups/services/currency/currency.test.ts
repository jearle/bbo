import {currencies} from "shared/dist/helpers/types/currency";
import {createCurrencyService} from "./";

describe('currencyService', () => {

  describe('getCurrencies()', () => {
    it('should return array of currencies', () => {
      const service = createCurrencyService();
      const result = service.getCurrencies();
      expect(result).toBe(currencies);
    })
  })
})

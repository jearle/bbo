import * as express from 'express';
import { fetchJSONOnRandomPort } from 'shared/dist/helpers/express/listen-fetch';
import { createApp } from './';
import { createCurrencyService } from '../../services/currency';
import { createDataTypeService } from '../../services/data-type';

describe('lookups app', () => {
  let app = null;

  beforeEach(async () => {
    app = express();
    app.use(express.json());
    app.use((req, res, next) => {
      req.jwtPayload = { username: `jearle@rcanalytics.com` };
      next();
    });

    const currencyService = createCurrencyService();
    const dataTypeService = createDataTypeService();

    const lookupsApp = createApp({ currencyService, dataTypeService });

    app.use(lookupsApp);
  });

  describe(`/currency`, () => {
    test(`/currency`, async () => {
      const { data } = await fetchJSONOnRandomPort(app, {
        path: `/currency`,
      });

      expect(data.length).toBeGreaterThan(0);
    });
  });

  describe(`/data-type`, () => {
    test(`/data-type/:propertyType`, async () => {
      const { data } = await fetchJSONOnRandomPort(app, {
        path: `/data-type/apartment`,
      });

      expect(data.length).toBeGreaterThan(0);
    });
  });
});

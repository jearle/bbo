import * as express from 'express';
import {createApp} from "./";
import {currencies} from "shared/dist/helpers/types/currency";
import {createCurrencyService} from "../../services/currency";
import {fetchJSONOnRandomPort} from "shared/dist/helpers/express/listen-fetch";

describe('lookups app', () => {
  let app = null;
  let lookupsApp = null;
  beforeEach(async () => {
    app = express();
    app.use(express.json());
    app.use((req, res, next) => {
      req.jwtPayload = { username: 'jearle@rcanalytics.com' };
      next();
    });

    const currencyService = createCurrencyService();

    lookupsApp = createApp({ currencyService });
  });

  describe('/currency', () => {
    test('/currency', async () => {
      app.use(lookupsApp);
      const { data } = await fetchJSONOnRandomPort(app, {
        method: 'GET',
        path: '/currency',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }
      });
      expect(data.length).toBe(currencies.length);
    });
  });
});

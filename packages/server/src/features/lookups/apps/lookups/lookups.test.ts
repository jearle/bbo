import fetch from 'node-fetch';
import * as express from 'express';
import {createApp} from "./";
import {portListen} from "shared/dist/helpers/express/port-listen";
import {currencies} from "shared/dist/helpers/types/currency";
import {createCurrencyService} from "../../services/currency";

describe('lookups app', () => {
  let server = null;
  let app = null;
  let lookupsApp = null;
  let url = null;
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

  afterEach(() => {
    server.close();
  });

  describe('/currency', () => {
    test('/currency', async () => {
      app.use(lookupsApp);
      server = await portListen(app);
      url = `http://localhost:${server.address().port}`;
      const result = await fetch(`${url}/currency`);
      const { data } = await result.json();
      expect(data.length).toBe(currencies.length);
    });
  });
});

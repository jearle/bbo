import * as express from 'express';
import { Application } from 'express';
import {CurrencyService} from "../../services/currency";

export const VERSION = `v0`;
export const DESCRIPTION = `Lookups API`;
export const BASE_PATH = `/api/lookups/${VERSION}`;

interface CreateAppInputs {
  currencyService: CurrencyService;
}

export const createApp = ({
  currencyService
}: CreateAppInputs): Application => {
  const app = express();

  /**
   * @swagger
   *
   * /currency
   *  get:
   *    description: Gets currency lookup values
   *    produces:
   *      - application/json
   *    responses:
   *      200:
   *        description: CurrencyLookupsResponse
   */
  app.get(`/currency`, async (req, res) => {
    const data = currencyService.getCurrencies();
    res.json({ data });
  });

  return app;
}

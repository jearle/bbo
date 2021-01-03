import * as express from 'express';
import { Application } from 'express';
import { readFile } from 'fs/promises';

export const createPemsApp = (): Application => {
  const app = express();

  app.get(`/jwks.json`, async (req, res) => {
    const keysDir = `${__dirname}/../../../../keys`;

    const publicKey = await readFile(`${keysDir}/public.key`, `utf8`);

    res.json({
      [`ZylbFME6ivvlTkbfqBmWJZy617R1No6lmoAtDkn+yWE=`]: publicKey,
    });
  });

  return app;
};

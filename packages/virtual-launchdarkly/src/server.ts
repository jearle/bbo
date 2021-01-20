import * as express from 'express';
import { json } from 'body-parser';
import { createServer } from 'http';
import { AddressInfo } from 'net';

import { createHandlersFeature } from './features/handlers';

type StartServerInputs = {
  readonly host: string;
  readonly port: number;
};

export const startServer = async ({
  host,
  port,
}: StartServerInputs): Promise<void> => {
  // features
  const {
    diagnosticUri,
    diagnosticApp,

    allUri,
    allApp,
  } = createHandlersFeature();
  // end features
  const mounts = express();
  mounts.use(json());
  mounts.use((req, res, next) => {
    // console.log(`METHOD`, req.method);
    // console.log(`URL`, req.url);
    // console.log(`HEADERS`, req.headers);
    // console.log(`BODY`, req.body);
    // console.log(`PARAMS`, req.params);

    next();
  });

  mounts.use(diagnosticUri, diagnosticApp());
  mounts.use(allUri, allApp());

  const server = createServer(mounts);
  server.listen(port, host, () => {
    const addressInfo = server.address() as AddressInfo;

    const host = addressInfo.address;

    console.log(`info`, `listening: http://${host}:${addressInfo.port}`);
  });
};

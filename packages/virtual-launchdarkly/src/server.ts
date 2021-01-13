import * as express from 'express';
import { json } from 'body-parser';
import { createServer } from 'http';
import { AddressInfo } from 'net';

type StartServerInputs = {
  readonly host: string;
  readonly port: number;
};

export const startServer = async ({
  host,
  port,
}: StartServerInputs): Promise<void> => {
  // features

  // end features
  const mounts = express();
  mounts.use(json());

  // start server
  const server = createServer(mounts);
  server.listen(port, host, () => {
    const addressInfo = server.address() as AddressInfo;

    const host = addressInfo.address;

    console.log(`info`, `listening: http://${host}:${addressInfo.port}`);
  });
};

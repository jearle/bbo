import * as express from 'express';
import { json } from 'body-parser';
import { createServer } from 'http';
import { AddressInfo } from 'net';
import { createUserStoreFeature } from './features/user-store';
import { createTargetFeature } from './features/target';
import { createHandlersFeature } from './features/handlers';
import { createPublicKeysFeature } from './features/public-keys';
import cors from 'cors';

type StartServerInputs = {
  readonly host: string;
  readonly port: number;
};

export const startServer = async ({
  host,
  port,
}: StartServerInputs): Promise<void> => {
  // features
  const { userStore } = createUserStoreFeature();
  const { handlers } = createHandlersFeature({ userStore });
  const { targetFeatureMiddleware } = createTargetFeature({
    handlers,
  });
  const { publicKeysApp } = createPublicKeysFeature();

  // end features
  const mounts = express();

  mounts.use(`/public-keys`, publicKeysApp());

  mounts.use((req, res, next) => {
    req.headers[`content-type`] = `application/json`;
    next();
  });

  mounts.use(targetFeatureMiddleware());

  mounts.use(json());

  const app = express();

  app.use(
    [
      cors(),
      async (req, res) => {
        const { statusCode, body } = await req.handler(req);
        res.status(statusCode).send(body);
      }
    ]
  );

  mounts.use(app);

  // start server
  const server = createServer(mounts);
  server.listen(port, host, () => {
    const addressInfo = server.address() as AddressInfo;

    const host = addressInfo.address;

    console.log(`info`, `listening: http://${host}:${addressInfo.port}`);
  });
};

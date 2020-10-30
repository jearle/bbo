import * as express from 'express';
import { AddressInfo } from 'net';
import { createApp, VERSION } from './app';
import logger, {
  loggerIdMiddlewware,
  loggerMiddleware,
  loggerErrorMiddleware,
} from './logger';

interface ServerOptions {
  port?: number;
  host?: string;
}

export const startServer = async ({
  port = 0,
  host = `127.0.0.1`
}: ServerOptions) => {
  const mounts = express();

  const app = createApp();

  mounts.use(loggerIdMiddlewware());
  mounts.use(loggerMiddleware());
  mounts.use(`/api/${VERSION}`, app);
  mounts.use(loggerErrorMiddleware());

  mounts.listen(port, host, () => {
    const addressInfo = mounts.address() as AddressInfo;

    const host = addressInfo.address;

    logger.log(`info`, `listening: https://${host}:${addressInfo.port}`);
  });
};

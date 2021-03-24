import * as express from 'express';
import { portListen } from './port-listen';

export const getRandomPort = async (): Promise<number> => {
  const app = express();
  const server = await portListen(app);
  const { port } = server.address();

  await server.close();

  return port;
};

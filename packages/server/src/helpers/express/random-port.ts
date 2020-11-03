import * as express from 'express';
import { portListen } from './port-listen';

export const getRandomPort = async () => {
  const app = express();
  const server = await portListen(app);
  const { port } = server.address();
  server.close();
  return port;
};

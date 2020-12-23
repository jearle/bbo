import { Application } from 'express';
import fetch from 'node-fetch';

import { portListen } from '../express/port-listen';

export const testHealthcheck = async (app: Application): Promise<void> => {
  const server = await portListen(app);
  const { port } = server.address();

  const response = await fetch(`http://localhost:${port}/healthcheck`);
  const json = await response.json();

  expect(json.health).toBe(`ok`);

  server.close();
};

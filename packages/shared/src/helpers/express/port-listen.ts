import { Application } from 'express';
import { createServer, Server } from 'http';
import { AddressInfo } from 'net';

import { closeServer } from './close-server';

type PortListenInputs = {
  port?: number;
};

const createPortListenServer = (server: Server) => ({
  server,
  address() {
    return server.address() as AddressInfo;
  },
  close() {
    return closeServer(server);
  },
});

export type PortListenServer = ReturnType<typeof createPortListenServer>;

export const portListen = (
  app: Application,
  { port = 0 }: PortListenInputs = {}
): Promise<PortListenServer> => {
  return new Promise((resolve) => {
    const server = createServer(app).listen(port, () => {
      const portListenServer = createPortListenServer(server);
      resolve(portListenServer);
    });
  });
};

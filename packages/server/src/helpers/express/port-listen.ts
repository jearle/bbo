import { Application } from 'express';
import { createServer } from 'http';

interface PortListenOptions {
  port?: number;
}

export const portListen = (
  app: any,
  { port = 0 }: PortListenOptions = {}
): Promise<Application> => {
  const promise = new Promise((resolve) => {
    const server = createServer(app).listen(port, () => {
      resolve(server);
    });
  }) as Promise<Application>;

  return promise;
};

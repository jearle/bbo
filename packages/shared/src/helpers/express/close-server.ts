import { Server } from 'http';

export const closeServer = (server: Server): Promise<void> => {
  return new Promise((resolve, reject) => {
    server.close((err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

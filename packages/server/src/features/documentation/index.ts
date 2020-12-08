import * as express from 'express';
import { createApp } from './apps/documentation';

const documentationFeature = () => ({
  documentationApp() {
    const app = express();

    // app.use(
    //   `/documentation/transactions-search`,
    //   createApp({
    //     feature: `transactions-search`,
    //     description: `Transactions Search Documentation`,
    //     host: `localhost`,
    //     port: `39000`,
    //     basePath: `/api/transactions-search/v0`,
    //   })
    // );

    app.use(
      `/documentation/authentication`,
      createApp({
        feature: `authentication`,
        description: `Authentication Documentation`,
        host: `localhost`,
        port: 39000,
        basePath: `/api/authentication/v0`,
        version: `v0`,
      })
    );

    return app;
  },
});

export type DocumentationFeature = ReturnType<typeof documentationFeature>;

export const createDocumentationFeature = (): DocumentationFeature => {
  return documentationFeature();
};

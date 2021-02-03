import * as express from 'express';
import { createApp } from './apps/documentation';

import * as AuthenticationApp from '../authentication/apps/authentication';
import * as GeographyApp from '../geography/apps/geography';
import * as TransactionsSearchApp from '../transactions-search/apps/transactions-search';

const documentationFeature = () => ({
  documentationApp() {
    const app = express();

    app.use(
      `/documentation/authentication`,
      createApp({
        feature: `authentication`,
        description: AuthenticationApp.DESCRIPTION,
        basePath: AuthenticationApp.BASE_PATH,
        version: AuthenticationApp.VERSION,
      })
    );

    app.use(
      `/documentation/geography`,
      createApp({
        feature: `geography`,
        description: GeographyApp.DESCRIPTION,
        basePath: GeographyApp.BASE_PATH,
        version: GeographyApp.VERSION,
      })
    );

    app.use(
      `/documentation/transactions-search`,
      createApp({
        feature: `transactions-search`,
        description: TransactionsSearchApp.DESCRIPTION,
        basePath: TransactionsSearchApp.BASE_PATH,
        version: TransactionsSearchApp.VERSION,
      })
    );

    return app;
  },
});

export type DocumentationFeature = ReturnType<typeof documentationFeature>;

export const createDocumentationFeature = (): DocumentationFeature => {
  return documentationFeature();
};

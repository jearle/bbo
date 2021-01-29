import * as express from 'express';
import { createApp } from './apps/documentation';

import * as AuthenticationApp from '../authentication/apps/authentication';
import * as GeographyApp from '../geography/apps/geography';

type CreateApiPathInput = {
  readonly feature: string;
};

const createApiPath = ({ feature }: CreateApiPathInput): string => {
  return `${__dirname}/../${feature}/**/*.{js,ts}`;
};

const documentationFeature = () => ({
  documentationApp() {
    const app = express();

    app.use(
      `/documentation/authentication`,
      createApp({
        title: `Authentication API`,
        description: AuthenticationApp.DESCRIPTION,
        basePath: AuthenticationApp.BASE_PATH,
        version: AuthenticationApp.VERSION,
        apiPath: createApiPath({ feature: `authentication` }),
      })
    );

    app.use(
      `/documentation/geography`,
      createApp({
        title: `Geography API`,
        description: GeographyApp.DESCRIPTION,
        basePath: GeographyApp.BASE_PATH,
        version: GeographyApp.VERSION,
        apiPath: createApiPath({ feature: `geography` }),
      })
    );

    return app;
  },
});

export type DocumentationFeature = ReturnType<typeof documentationFeature>;

export const createDocumentationFeature = (): DocumentationFeature => {
  return documentationFeature();
};

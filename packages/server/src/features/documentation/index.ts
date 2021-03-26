import * as express from 'express';
import { createApp } from './apps/documentation';

const documentationConfigurations: Array<string> = [
  `authentication`,
  `geography`,
  `property-type`,
  `transactions-search`,
  `lookups`,
];

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
      '/documentation/v0',
      createApp({
        title: `Product API title`,
        description: `Product API description`,
        version: 'v0',
        apiPaths: documentationConfigurations.map((feature) =>
          createApiPath({ feature })
        ),
      })
    );

    return app;
  },
});

export type DocumentationFeature = ReturnType<typeof documentationFeature>;

export const createDocumentationFeature = (): DocumentationFeature => {
  return documentationFeature();
};

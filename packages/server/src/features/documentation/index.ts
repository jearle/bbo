import * as express from 'express';
import { BASE_PATH, createApp } from './apps/documentation';

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
  documentationBasePath: BASE_PATH,

  documentationApp() {
    const app = express();

    app.use(
      '/',
      createApp({
        title: `RCA API`,
        description: `Real Capital Analytics API`,
        version: 'v0',
        apiPaths: documentationConfigurations.map((feature) =>
          createApiPath({ feature })
        ),
        tags: documentationConfigurations.sort().map((dc) => {
          // sort the features and format to match the tags so that sections appear in order
          return {
            name: dc.replace(/-/g, ' ').replace(/(\w)(\w*)/g, (g0, g1, g2) => {
              return g1.toUpperCase() + g2.toLowerCase();
            }),
          };
        }),
      })
    );

    return app;
  },
});

export type DocumentationFeature = ReturnType<typeof documentationFeature>;

export const createDocumentationFeature = (): DocumentationFeature => {
  return documentationFeature();
};

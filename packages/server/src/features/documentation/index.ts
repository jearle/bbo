import * as express from 'express';
import { createApp } from './apps/documentation';

import * as AuthenticationApp from '../authentication/apps/authentication';
import * as GeographyApp from '../geography/apps/geography';
import * as PropertyTypeApp from '../property-type/apps/property-type';
import * as TransactionsSearchApp from '../transactions-search/apps/transactions-search';
import * as LookupsApp from '../lookups/apps/lookups';

type FeatureApp = {
  readonly DESCRIPTION: string;
  readonly BASE_PATH: string;
  readonly VERSION: string;
};

type DocumentationConfiguration = {
  readonly title: string;
  readonly feature: string;
  readonly featureApp: FeatureApp;
};

const documentationConfigurations: Array<DocumentationConfiguration> = [
  {
    title: `Authentication API`,
    feature: `authentication`,
    featureApp: AuthenticationApp,
  },
  {
    title: `Geography API`,
    feature: `geography`,
    featureApp: GeographyApp,
  },
  {
    title: `Property Type API`,
    feature: `property-type`,
    featureApp: PropertyTypeApp,
  },
  {
    title: `Transactions Search API`,
    feature: `transactions-search`,
    featureApp: TransactionsSearchApp,
  },
  {
    title: `Lookups API`,
    feature: `lookups`,
    featureApp: LookupsApp
  },
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

    documentationConfigurations.forEach(({ title, feature, featureApp }) => {
      app.use(
        `/documentation/${feature}`,
        createApp({
          title,
          description: featureApp.DESCRIPTION,
          basePath: featureApp.BASE_PATH,
          version: featureApp.VERSION,
          apiPath: createApiPath({ feature }),
        })
      );
    });

    return app;
  },
});

export type DocumentationFeature = ReturnType<typeof documentationFeature>;

export const createDocumentationFeature = (): DocumentationFeature => {
  return documentationFeature();
};

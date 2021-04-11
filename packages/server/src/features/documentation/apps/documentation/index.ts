import * as express from 'express';
import { Application } from 'express';
import { serve, setup } from 'swagger-ui-express';
import { createSpec, tag } from '../../helpers/spec';

export const VERSION = `v0`;
export const DESCRIPTION = `Documentation`;
export const BASE_PATH = `/documentation/${VERSION}`;

type CreateAppInputs = {
  readonly title: string;
  readonly description: string;
  readonly version: string;
  readonly apiPaths: string[];
  readonly tags: tag[];
};

export const createApp = ({
  title,
  description,
  version,
  apiPaths,
  tags
}: CreateAppInputs): Application => {
  const app = express();

  const swaggerOptions = {
    swaggerOptions: {
      // sort methods by method type then path
      operationsSorter: (a, b) => {
        const methodsOrder = ["get", "post", "put", "patch", "delete", "options", "trace"];
        let result = methodsOrder.indexOf(a.get("method")) - methodsOrder.indexOf(b.get("method"));

        if (result === 0) {
          result = a.get("path").localeCompare(b.get("path"));
        }

        return result;
      }
    }
  };
  app.use(serve, setup(createSpec({ title, description, version, apiPaths, tags }), swaggerOptions));

  return app;
};

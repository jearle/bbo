import { Application } from 'express';
import * as swaggerJSDoc from 'swagger-jsdoc';
import { serve, setup } from 'swagger-ui-express';

const getSpec = ({ host, port, basePath, description }) =>
  swaggerJSDoc({
    definition: {
      openapi: `3.0.0`,
      servers: [
        {
          url: `http://{host}:{port}{basePath}`,
          description,
          variables: {
            host: {
              default: host,
            },
            port: {
              default: port,
            },
            basePath: {
              default: basePath,
            },
          },
        },
      ],
      info: {
        title: `Product API`,
        description: `Product API`,
      },
    },
    apis: [`./dist/apps/company/index.js`],
  });

interface SwaggerDocumentationOptions {
  host: string;
  port: number;
  basePath: string;
  description: string;
}

export const useSwaggerDocumentation = (
  app: Application,
  { host, port, basePath, description }: SwaggerDocumentationOptions
) =>
  app.use(
    `${basePath === `/` ? `` : basePath}/documentation`,
    serve,
    setup(
      getSpec({
        host,
        port,
        basePath,
        description,
      })
    )
  );

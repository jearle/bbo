import * as swaggerJSDoc from 'swagger-jsdoc';

type CreateSpecInputs = {
  readonly feature: string;
  readonly description: string;
  readonly version: string;
  readonly host: string;
  readonly port: number;
  readonly basePath: string;
};

type CreateSpecResult = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

export const createSpec = ({
  feature,
  description,
  version,
  host,
  port,
  basePath,
}: CreateSpecInputs): CreateSpecResult => {
  return swaggerJSDoc({
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
        version,
      },
    },
    apis: [`./dist/features/${feature}/**/*.js`],
  });
};

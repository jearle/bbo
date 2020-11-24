import * as swaggerJSDoc from 'swagger-jsdoc';

type CreateSpecInput = {
  readonly feature: string;
  readonly description: string;
  readonly host: string;
  readonly port: number;
  readonly basePath: string;
};

export const createSpec = ({
  feature,
  description,
  host,
  port,
  basePath,
}: CreateSpecInput) => {
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
      },
    },
    apis: [`./dist/features/${feature}/**/*.js`],
  });
};

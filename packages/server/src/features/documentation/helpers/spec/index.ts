import * as swaggerJSDoc from 'swagger-jsdoc';

type CreateSpecInputs = {
  readonly feature: string;
  readonly description: string;
  readonly version: string;
  readonly basePath: string;
};

type CreateSpecResult = unknown & {
  readonly paths?: { [key: string]: unknown };
};

export const createSpec = ({
  feature,
  description,
  version,
  basePath,
}: CreateSpecInputs): CreateSpecResult => {
  return swaggerJSDoc({
    definition: {
      openapi: `3.0.0`,
      servers: [
        {
          url: `{basePath}`,
          variables: {
            basePath: { default: basePath },
          },
        },
      ],
      info: {
        title: feature,
        description: description,
        version,
      },
      components: {
        securitySchemes: {
          ApiKeyAuth: {
            type: 'apiKey',
            name: 'accessToken',
            in: 'header',
            description: 'request need accessToken for auth'
          }
        }
      },
      security: [{
        ApiKeyAuth: []
      }]
    },
    apis: [`./dist/features/${feature}/**/*.js`],
  });
};

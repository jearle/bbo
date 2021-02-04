import * as swaggerJSDoc from 'swagger-jsdoc';

type CreateSpecInputs = {
  readonly title: string;
  readonly description: string;
  readonly version: string;
  readonly basePath: string;
  readonly apiPath: string;
};

type CreateSpecResult = unknown & {
  readonly paths?: { [key: string]: unknown };
};

export const createSpec = ({
  title,
  description,
  version,
  basePath,
  apiPath,
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
        title,
        description: description,
        version,
      },
      components: {
        securitySchemes: {
          ApiKeyAuth: {
            type: 'apiKey',
            name: 'accessToken',
            in: 'header',
            description: 'request need accessToken for auth',
          },
        },
      },
      security: [
        {
          ApiKeyAuth: [],
        },
      ],
    },
    apis: [apiPath],
  });
};

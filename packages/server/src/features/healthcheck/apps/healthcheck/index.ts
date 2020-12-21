import * as express from 'express';
import { Application } from 'express';
import { CognitoHealthService } from '../../services/cognito';

import { ElasticsearchHealthService } from '../../services/elasticsearch';
import { LaunchDarklyHealthService } from '../../services/launchdarkly';
import { RCAWebAccountsHealthService } from '../../services/rca-web-accounts';
import { RedisHealthService } from '../../services/redis';

export const VERSION = `v0`;
export const DESCRIPTION = `Ping`;
export const BASE_PATH = `/api/healthcheck/${VERSION}`;

type CreateAppInputs = {
  readonly elasticsearchHealthService: ElasticsearchHealthService;
  readonly rcaWebAccountsHealthService: RCAWebAccountsHealthService;
  readonly redisHealthService: RedisHealthService;
  readonly launchDarklyHealthService: LaunchDarklyHealthService;
  readonly cognitoHealthService: CognitoHealthService;
};

export const createApp = ({
  elasticsearchHealthService,
  rcaWebAccountsHealthService,
  redisHealthService,
  launchDarklyHealthService,
  cognitoHealthService,
}: CreateAppInputs): Application => {
  const app = express();

  /**
   * @swagger
   *
   * /ping:
   *   get:
   *     description: Responds with 200 OK
   *     produces:
   *       - text/plain
   *     responses:
   *       200:
   *         description: OK
   */
  app.get(`/ping`, async (req, res) => {
    res.sendStatus(200);
  });

  /**
   * @swagger
   *
   * /healthcheck:
   *   get:
   *     description: Gets health of app and external services
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: health
   */
  app.get(`/healthcheck`, async (req, res) => {
    const endpoints = [
      await elasticsearchHealthService.health(),
      await rcaWebAccountsHealthService.health(),
      await redisHealthService.health(),
      await launchDarklyHealthService.health(),
      await cognitoHealthService.health(),
    ];
    const apiHealth = endpoints.reduce(
      (apiStatus, currentService) => {
        const msg =
          currentService.status === 0
            ? apiStatus.msg
            : `${apiStatus.msg}${currentService.name} Failed;`;
        const status = Math.max(apiStatus.status, currentService.status);
        return { ...apiStatus, status, msg };
      },
      {
        name: 'Product API',
        status: 0,
        msg: '',
      }
    );

    res.json({
      ...apiHealth,
      msg: apiHealth.msg || 'ok',
      endpoints,
    });
  });

  return app;
};

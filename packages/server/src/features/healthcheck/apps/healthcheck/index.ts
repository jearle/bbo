import * as express from 'express';
import { Application } from 'express';

import { ElasticsearchHealthService } from '../../services/elasticsearch';
import { RCAWebAccountsHealthService } from '../../services/rca-web-accounts';
import { RedisHealthService } from '../../services/redis';

export const VERSION = `v0`;
export const DESCRIPTION = `Ping`;
export const BASE_PATH = `/api/healthcheck/${VERSION}`;

type CreateAppInputs = {
  readonly elasticsearchHealthService: ElasticsearchHealthService;
  readonly rcaWebAccountsHealthService: RCAWebAccountsHealthService;
  readonly redisHealthService: RedisHealthService;
};

export const createApp = ({
  elasticsearchHealthService,
  rcaWebAccountsHealthService,
  redisHealthService,
}: CreateAppInputs): Application => {
  const app = express();

  app.get(`/ping`, async (req, res) => {
    res.sendStatus(200);
  });

  app.get(`/healthcheck`, async (req, res) => {
    const endpoints = [
      await elasticsearchHealthService.health(),
      await rcaWebAccountsHealthService.health(),
      await redisHealthService.health(),
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

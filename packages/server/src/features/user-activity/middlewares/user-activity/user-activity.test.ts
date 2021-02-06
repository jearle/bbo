import * as express from 'express';
import fetch from 'node-fetch';
import { json } from 'body-parser';
import { portListen } from 'shared/dist/helpers/express/port-listen';
import { fetchTextOnRandomPort } from 'shared/dist/helpers/express/listen-fetch';
import { userActivityMiddleWare } from './index';
import {
  createUserActivityService,
  UserActivityService,
} from '../../services/user-activity';

import {
  createSegmentProvider,
  SegmentProvider,
} from '../../providers/segment';
import {
  CognitoProvider,
  createCognitoProvider,
} from '../../../../providers/cognito';
import {
  AuthenticationService,
  createAuthenticationService,
} from '../../../authentication/services/authentication';
import { authenticationMiddleware as createAuthenticationMiddleware } from '../../../authentication/middlewares/authentication';
import { createApp } from '../../../transactions-search/apps/transactions-search';
import { createApp as createAuthenticationApp } from '../../../authentication/apps/authentication';

import { createTransactionsSearchService } from '../../../transactions-search/services/transactions-search';
import { createElasticsearchProvider } from '../../../../providers/elasticsearch';
import { createMSSQLProvider } from '../../../../providers/mssql';
import { createRedisProvider } from '../../../../providers/redis';
import { createRCAWebAccountsService } from '../../../permissions/services/rca-web-accounts';
import { createPermissionsService } from '../../../permissions/services/permissions';
import { permissionsMiddleware as createPermissionsMiddleware } from '../../../permissions/middlewares/permissions';

const {
  SEGMENT_ACCESS_KEY,
  COGNITO_REGION,
  COGNITO_USER_POOL_ID,
  COGNITO_APP_CLIENT_ID,
  COGNITO_APP_CLIENT_SECRET,
  MSSQL_URI,
  REDIS_URI,
  ELASTICSEARCH_NODE,
  ELASTICSEARCH_USERNAME,
  ELASTICSEARCH_PASSWORD,
} = process.env;

describe(`SegmentProvider`, () => {
  let authenticationService: AuthenticationService;
  let cognitoService: CognitoProvider;
  let authenticationMiddleware;
  let segmentProvider: SegmentProvider;
  let userActivityService: UserActivityService;
  let userActivityMiddleware: void;
  let app;
  let url = null;
  let authenticationApp;

  beforeAll(async () => {
    cognitoService = await createCognitoProvider({
      region: COGNITO_REGION,
      userPoolId: COGNITO_USER_POOL_ID,
      appClientId: COGNITO_APP_CLIENT_ID,
      appClientSecret: COGNITO_APP_CLIENT_SECRET,
    });

    authenticationService = await createAuthenticationService({
      cognitoService,
    });

    authenticationMiddleware = createAuthenticationMiddleware({
      authenticationService,
    });
    segmentProvider = createSegmentProvider({
      accessKey: SEGMENT_ACCESS_KEY,
    });
    userActivityService = createUserActivityService({
      segmentProvider,
    });

    userActivityMiddleware = userActivityMiddleWare({
      userActivityService,
    });

    authenticationApp = createAuthenticationApp({ authenticationService });
  });

  beforeEach(() => {
    app = express();
    app.use(userActivityMiddleware);
    app.use(json());
  });

  test(`middleware called without jwt token`, async () => {
    app.get(`/`, (req, res) => {
      res.send(`foo`);
    });

    const text = await fetchTextOnRandomPort(app);

    expect(text).toBe(`foo`);
  });

  test(`Middleware calls the identify method when login or register endpoint`, async () => {
    app.use(authenticationApp);
    app.use(authenticationMiddleware);
    const userActivityServiceSpy = jest.spyOn(userActivityService, 'identify');
    const server = await portListen(app);
    url = `http://localhost:${server.address().port}`;
    await fetch(`${url}/login`, {
      method: 'post',
      body: JSON.stringify({
        username: `user-for-tests`,
        password: `=Z9-xW%7`,
      }),
      headers: { 'Content-Type': 'application/json' },
    });
    expect(userActivityServiceSpy).toHaveBeenCalledWith({
      traits: {
        email: 'user-for-tests',
      },
      userId: expect.any(String),
    });
  });

  test(`Middleware calls the track method for all other endpoints`, async () => {
    const elasticsearchProvider = createElasticsearchProvider({
      node: ELASTICSEARCH_NODE,
      username: ELASTICSEARCH_USERNAME,
      password: ELASTICSEARCH_PASSWORD,
    });

    const mssqlProvider = await createMSSQLProvider({ uri: MSSQL_URI });
    const redisProvider = createRedisProvider({ uri: REDIS_URI });
    const rcaWebAccountsService = await createRCAWebAccountsService({
      mssqlProvider,
    });

    const permissionsService = createPermissionsService({
      rcaWebAccountsService,
      redisProvider,
    });

    const permissionsMiddleware = createPermissionsMiddleware({
      permissionsService,
    });

    const transactionsSearchService = createTransactionsSearchService({
      elasticsearchProvider,
    });

    const transactionsSearchApp = createApp({ transactionsSearchService });

    app.use((req, res, next) => {
      req.jwtPayload = {
        sub: 'dsa-213--213',
        username: 'jearle@rcanalytics.com',
      };
      next();
    });

    app.use(permissionsMiddleware);
    app.use(transactionsSearchApp);
    const userActivityServiceSpy = jest.spyOn(userActivityService, 'track');
    const server = await portListen(app);
    url = `http://localhost:${server.address().port}`;
    await fetch(`${url}/transactions`);
    expect(userActivityServiceSpy).toHaveBeenCalledWith({
      userId: 'dsa-213--213',
      event: 'EventNameFromSwaggerDocs',
      properties: {
        statusCode: 200,
        reqData: { data: 'reqbody or query parameters?' },
        resData: { data: 'data' },
      },
    });
  });
});

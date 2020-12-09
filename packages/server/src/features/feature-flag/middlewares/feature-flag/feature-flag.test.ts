import * as express from 'express';

import { featureFlagMiddleware as createFeatureFlagMiddleware } from '.';

import { fetchResponseOnRandomPort } from '../../../../helpers/express/listen-fetch';

import {
  createFeatureFlagService,
  FeatureFlagService,
} from '../../services/feature-flag';
import { createLaunchdarklyProvider } from '../../providers/launchdarkly';

const { LAUNCH_DARKLY_SDK } = process.env;

describe(`authenticationMiddleware`, () => {
  let featureFlagService: FeatureFlagService;
  let featureFlagMiddleware;
  let app;

  beforeAll(async () => {
    const launchdarklyProvider = await createLaunchdarklyProvider({
      sdkKey: LAUNCH_DARKLY_SDK,
    });

    featureFlagService = await createFeatureFlagService({
      launchdarklyProvider,
    });

    featureFlagMiddleware = createFeatureFlagMiddleware({
      featureFlagService,
    });
  });

  afterAll(async () => {
    await featureFlagService.close();
  });

  beforeEach(() => {
    app = express();
  });

  test(`should return 404, for a feature flag with  off-variation=false`, async () => {
    app.use(featureFlagMiddleware);
    app.get(`/`, (req, res) => {
      res.send(`pass`);
    });

    const { status } = await fetchResponseOnRandomPort(app, {
      query: `flag-name=ff-release-api-27-set-up-launch-darkly&default-value=true`,
    });
    expect(status).toBe(404);
  });

  test(`should return 200, for a true flag`, async () => {
    app.use(featureFlagMiddleware);
    app.get(`/`, (req, res) => {
      res.send(`pass`);
    });

    const { status } = await fetchResponseOnRandomPort(app, {
      query: `flag-name=ff-debug-test-true`,
    });

    expect(status).toBe(200);
  });

  test(`should return 404, for a false flag`, async () => {
    app.use(featureFlagMiddleware);
    app.get(`/`, (req, res) => {
      res.send(`pass`);
    });

    const { status } = await fetchResponseOnRandomPort(app, {
      query: `flag-name=ff-debug-test-false&default-value=true`,
    });
    expect(status).toBe(404);
  });
});

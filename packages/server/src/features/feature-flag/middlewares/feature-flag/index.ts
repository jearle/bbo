import { Request, Response } from 'express';

import { FeatureFlagService } from '../../services/feature-flag';

type FeatureFlagMiddlewareInput = {
  featureFlagService: FeatureFlagService;
};

type FeatureFlagMiddlewareResult = (
  req: Request,
  res: Response,
  next: Function
) => void;

export const featureFlagMiddleware = ({
  featureFlagService,
}: FeatureFlagMiddlewareInput): FeatureFlagMiddlewareResult => async (
  req,
  res,
  next
) => {
  const {
    [`flag-name`]: flagName,
    [`override-feature-flag`]: overrideFeatureFlag,
  } = req.query;

  const featureFlagValue =
    (await featureFlagService.fetchFeatureFlag({
      flagName,
    })) === `true`;

  const shouldOverrideFeatureFlag = overrideFeatureFlag === `true`;

  if (featureFlagValue || shouldOverrideFeatureFlag) {
    return next();
  }

  res.status(404).send('Not Found');
};

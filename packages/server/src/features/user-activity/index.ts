import {
  createUserActivityService,
  UserActivityService,
} from './services/user-activity';
import { userActivityMiddleWare } from './middlewares/user-activity';
import { createSegmentProvider } from './providers/segment';

type UserActivityFeatureInputs = {
  readonly userActivityService: UserActivityService;
};

type CreateUserActivityFeatureInput = {
  readonly accessKey: string;
};

export type UserActivityFeatureInputOptions = CreateUserActivityFeatureInput;

const userActivityFeature = ({
  userActivityService,
}: UserActivityFeatureInputs) => ({
  userActivityMiddleWare() {
    return userActivityMiddleWare({ userActivityService });
  },
});

export type UserActivityFeature = ReturnType<typeof userActivityFeature>;

export const createUserActivityFeature = ({
  accessKey,
}: CreateUserActivityFeatureInput): UserActivityFeature => {
  const segmentProvider = createSegmentProvider({
    accessKey,
  });

  const userActivityService = createUserActivityService({
    segmentProvider,
  });

  return userActivityFeature({ userActivityService });
};

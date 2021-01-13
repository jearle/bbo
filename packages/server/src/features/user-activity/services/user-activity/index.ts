import { SegmentProvider } from '../../providers/segment';
import SegmentClient = require('analytics-node');

type CreateUserActivityServiceInputs = {
  segmentProvider: SegmentProvider;
};

type UserActivityServiceInputs = {
  segmentClient: SegmentClient;
};

const userActivityService = ({ segmentClient }: UserActivityServiceInputs) => ({
  identify(identifyInfo) {
    segmentClient.identify(identifyInfo);
  },

  track(trackInfo) {
    segmentClient.track(trackInfo);
  },
});

export type UserActivityService = ReturnType<typeof userActivityService>;

export const createUserActivityService = ({
  segmentProvider,
}: CreateUserActivityServiceInputs): UserActivityService => {
  const segmentClient = segmentProvider.createClient();

  return userActivityService({ segmentClient });
};

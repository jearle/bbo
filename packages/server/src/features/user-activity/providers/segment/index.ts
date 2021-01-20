import analytics = require('analytics-node');

type CreateSegmentProviderInputs = {
  readonly accessKey: string;
};

type SegmentProviderInputs = CreateSegmentProviderInputs;

const segmentProvider = ({ accessKey }: SegmentProviderInputs) => ({
  createClient(): analytics {
    const client = new analytics(accessKey);
    return client;
  },
});

export type SegmentProvider = ReturnType<typeof segmentProvider>;

export const createSegmentProvider = ({
  accessKey,
}: CreateSegmentProviderInputs): SegmentProvider => {
  return segmentProvider({ accessKey });
};

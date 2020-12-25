import { createSegmentProvider, SegmentProvider } from './index';

const { SEGMENT_ACCESS_KEY } = process.env;

describe(`SegmentProvider`, async () => {
  let segmentProvider: SegmentProvider;

  beforeAll(() => {
    segmentProvider = createSegmentProvider({
      accessKey: SEGMENT_ACCESS_KEY,
    });
  });

  test(`Create segmentprovider`, () => {
    const segmentClient = segmentProvider.createClient();
    expect(segmentClient).not.toBeUndefined();
  });
});

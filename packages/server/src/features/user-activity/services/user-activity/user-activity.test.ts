import {
  createSegmentProvider,
  SegmentProvider,
} from '../../providers/segment';
import { createUserActivityService, UserActivityService } from './index';

const { SEGMENT_ACCESS_KEY } = process.env;

let segmentProvider: SegmentProvider;
let userActivityService: UserActivityService;

beforeAll(() => {
  segmentProvider = createSegmentProvider({
    accessKey: SEGMENT_ACCESS_KEY,
  });

  userActivityService = createUserActivityService({
    segmentProvider,
  });
});

test(`We can call identify`, () => {
  const userActivityServiceSpy = jest.spyOn(userActivityService, 'identify');
  const identifyInfo = {
    userId: '2423434432',
    traits: {
      email: 'frej@email.com',
    },
  };
  userActivityService.identify(identifyInfo);
  expect(userActivityServiceSpy).toBeCalledTimes(1);
});

test(`We can call track`, () => {
  const userActivityServiceSpy = jest.spyOn(userActivityService, 'identify');
  const trackInfo = {
    userId: '2423434432',
    event: 'search properties',
    properties: {
      httpStatus: 200,
      searchRequestOptions: {
        countries: [''],
        maxPrice: 40000,
      },
      resultLength: 33,
      averagePrice: 30000,
      etc: 'etc',
    },
  };
  userActivityService.track(trackInfo);
  expect(userActivityServiceSpy).toBeCalledTimes(1);
});

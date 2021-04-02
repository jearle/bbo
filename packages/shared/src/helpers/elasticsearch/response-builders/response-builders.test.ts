import { esBucketResp, esHitsResponse } from '../stubs/responses';
import { getElasticHits, getTrendsDataFromElasticResponse } from './index';
describe(`response-builders`, () => {
  it(`should extract the hits from an elasticsearch response`, () => {
    const hits = getElasticHits(esHitsResponse);
    expect(hits).toEqual([
      {
        field1: true,
        field2: 'foo',
      },
      {
        field1: false,
        field2: 'bar',
      },
    ]);
  });
  describe(`minObservability`, () => {
    it(`returns trends data with nulls for pricing avg with < 2 docs`, () => {
      const trendsCapRateResp = getTrendsDataFromElasticResponse(
        esBucketResp,
        'CAPRATE'
      );
      const expected = [
        {
          date: '2001-04-01',
          value: 0.09524021214909023,
        },
        {
          date: '2001-07-01',
          value: 0.0885921259011541,
        },
        {
          date: '2001-10-01',
          value: 0.09269999961058299,
        },
        {
          date: '2002-01-01',
          value: null,
        },
      ];
      expect(trendsCapRateResp).toEqual(expected);
    });

    it(`returns trends data for volume metrics with no min doc count`, () => {
      const trendsCapRateResp = getTrendsDataFromElasticResponse(
        esBucketResp,
        'PRICE'
      );
      const expected = [
        {
          date: '2001-04-01',
          value: 0.09524021214909023,
        },
        {
          date: '2001-07-01',
          value: 0.0885921259011541,
        },
        {
          date: '2001-10-01',
          value: 0.09269999961058299,
        },
        {
          date: '2002-01-01',
          value: 0.08397576833764712,
        },
      ];
      expect(trendsCapRateResp).toEqual(expected);
    });
  });
});

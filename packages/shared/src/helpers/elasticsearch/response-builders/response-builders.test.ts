import { getElasticHits } from './index';
describe(`response-builders`, () => {
  const esResponse = {
    body: {
      took: 5,
      timed_out: false,
      _shards: {
        total: 2,
        successful: 2,
        skipped: 0,
        failed: 0,
      },
      hits: {
        total: {
          value: 10000,
          relation: 'gte',
        },
        max_score: 1.0,
        hits: [
          {
            _index: 'test_index',
            _type: '_doc',
            _id: 17,
            _score: 1.0,
            _source: {
              field1: true,
              field2: 'foo',
            },
          },
          {
            _index: 'test_index',
            _type: '_doc',
            _id: 16,
            _score: 1.0,
            _source: {
              field1: false,
              field2: 'bar',
            },
          },
        ],
      },
    },
  };
  it(`should extract the hits from an elasticsearch response`, () => {
    const hits = getElasticHits(esResponse);
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
});

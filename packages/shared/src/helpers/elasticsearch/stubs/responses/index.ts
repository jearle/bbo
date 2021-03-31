export const esBucketResp = {
  body: {
    "took": 5,
    "timed_out": false,
    "_shards": {
      "total": 4,
      "successful": 4,
      "skipped": 0,
      "failed": 0
    },
    "hits": {
      "total": {
        "value": 3904,
        "relation": "eq"
      },
      "max_score": null,
      "hits": []
    },
    "aggregations": {
      "sumPerQuarter": {
        "buckets": [
          {
            "key": "2001-01-01T00:00:00.000Z-2001-04-01T00:00:00.000Z",
            "from": 978307200000,
            "from_as_string": "2001-01-01T00:00:00.000Z",
            "to": 986083200000,
            "to_as_string": "2001-04-01T00:00:00.000Z",
            "doc_count": 18,
            "filteredSum": {
              "doc_count": 9,
              "sumResult": {
                "value": 0.09524021214909023
              }
            }
          },
          {
            "key": "2001-04-01T00:00:00.000Z-2001-07-01T00:00:00.000Z",
            "from": 986083200000,
            "from_as_string": "2001-04-01T00:00:00.000Z",
            "to": 993945600000,
            "to_as_string": "2001-07-01T00:00:00.000Z",
            "doc_count": 20,
            "filteredSum": {
              "doc_count": 7,
              "sumResult": {
                "value": 0.0885921259011541
              }
            }
          },
          {
            "key": "2001-07-01T00:00:00.000Z-2001-10-01T00:00:00.000Z",
            "from": 993945600000,
            "from_as_string": "2001-07-01T00:00:00.000Z",
            "to": 1001894400000,
            "to_as_string": "2001-10-01T00:00:00.000Z",
            "doc_count": 16,
            "filteredSum": {
              "doc_count": 3,
              "sumResult": {
                "value": 0.09269999961058299
              }
            }
          },
          {
            "key": "2001-10-01T00:00:00.000Z-2002-01-01T00:00:00.000Z",
            "from": 1001894400000,
            "from_as_string": "2001-10-01T00:00:00.000Z",
            "to": 1009843200000,
            "to_as_string": "2002-01-01T00:00:00.000Z",
            "doc_count": 10,
            "filteredSum": {
              "doc_count": 1,
              "sumResult": {
                "value": 0.08397576833764712
              }
            }
          }
        ]
      }
    }
  }
};

export const esHitsResponse = {
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

import { trendsSearchQuery } from './index';
import { Geography } from 'shared/dist/helpers/elasticsearch/constants';

describe('trends-search', () => {
  const atlantaFilter: Geography.Filter = {
    id: 21,
    type: Geography.Types.Metro,
    name: 'Atlanta'
  };
  it('creates a query with a geography filter', () => {
    const esQuery = trendsSearchQuery({ GeographyFilter: atlantaFilter });
    expect(esQuery.size).toEqual(0);
    expect(esQuery.query.bool.filter.bool.must.length).toBe(1);
    expect(esQuery.query.bool.filter.bool.must[0]).toEqual({
      terms: {
        "newMetro_id": [21]
      }
    });
  });
}); 

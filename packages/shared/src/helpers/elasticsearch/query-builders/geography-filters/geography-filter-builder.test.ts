import { Geography } from '../../constants';
import { createGeographyFilterTerms } from './index';

describe('geography-filter-builder', () => {
  const atlantaFilter: Geography.Filter = {
    id: 21,
    type: Geography.Types.Metro,
    name: 'Atlanta'
  };

  it('should throw an error for unknown geo type', () => {
    const filter: Geography.Filter = {
      id: 99,
      type: 99,
      name: 'foo'
    };
    expect(() => createGeographyFilterTerms([filter])).toThrowError('Unknown Geo Type');
  });

  it('creates a single filter', () => {
    const expectedResult = {
      terms: {
        "newMetro_id": [21]
      }
    };
    const result = createGeographyFilterTerms([atlantaFilter]);
    expect(result.length).toBe(1);
    expect(result[0]).toEqual(expectedResult);
  });

  it('adds prefix', () => {
    const expectedResult = {
      terms: {
        "company_newMetro_id": [21]
      }
    };
    const result = createGeographyFilterTerms([atlantaFilter], 'company_');
    expect(result[0]).toEqual(expectedResult);
  });

  it('parses stateProv type and id', () => {
    const filters: Geography.Filter[] = [
      {
        id: 99,
        type: Geography.Types.StateProv,
        name: 'test state1'
      },
      {
        id: 1111111,
        type: Geography.Types.StateProv,
        name: 'test state1'
      },
      {
        id: 2222222,
        type: Geography.Types.StateProv,
        name: 'test state2'
      },
      {
        id: 3333333,
        type: Geography.Types.StateProv,
        name: 'test state3'
      }
    ];
    const expectedResult = [
      {
        terms: {
          "adminLevel1_id": [99, 111111]
        }
      },
      {
        terms: {
          "adminLevel2_id": [222222]
        }
      },
      {
        terms: {
          "adminLevel3_id": [333333]
        }
      }
    ];
    const result = createGeographyFilterTerms(filters);
    expect(result).toEqual(expectedResult);
  });
});

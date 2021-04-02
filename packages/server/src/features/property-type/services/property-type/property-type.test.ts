import { createPropertyTypeService, PropertyTypeService } from '.';
import { createMSSQLProvider } from '../../../../providers/mssql';
import { createRedisProvider } from '../../../../providers/redis';

const { ANALYTICSDATA_MSSQL_URI: uri, REDIS_URI } = process.env;

describe('PropertyTypeService', () => {
  let propertyTypeService: PropertyTypeService;

  beforeAll(async () => {
    const mssqlProvider = createMSSQLProvider({ uri });
    const redisProvider = await createRedisProvider({ uri: REDIS_URI });
    propertyTypeService = await createPropertyTypeService({
      mssqlProvider,
      redisProvider,
    });
  });

  beforeEach(async () => {
    await propertyTypeService.clearAllCaches();
  });

  afterAll(async () => {
    await propertyTypeService.close();
  });

  test('fetchPropertyTypes', async () => {
    const result = await propertyTypeService.fetchPropertyTypes();

    expect(result).not.toBeUndefined();
  });

  test(`idForSlug`, async () => {
    const id = await propertyTypeService.idForSlug({ slug: `apartment-1` });

    expect(id).toBe(1);
  });

  test(`slugForId`, async () => {
    const slug = await propertyTypeService.slugForId({ id: 1 });

    expect(slug).toBe(`apartment-1`);
  });

  test(`slugForParentSlug`, async () => {
    const slug = await propertyTypeService.slugForParentSlug({
      slug: `office-cbd-102`,
    });

    expect(slug).toBe(`office-96`);
  });

  test(`parentSlugForSlugs`, async () => {
    const slugs = await propertyTypeService.parentSlugForSlugs({
      slug: `apartment-1`,
    });

    slugs.forEach(async (slug) => {
      const id = await propertyTypeService.idForSlug({ slug });

      expect(typeof id).toBe(`number`);
    });
  });

  test(`parentSlugForPropertySubTypeSlugs`, async () => {
    const allChildSlugs = await propertyTypeService.parentSlugForSlugs({
      slug: `apartment-1`,
    });

    const slugs = await propertyTypeService.parentSlugForPropertySubTypeSlugs({
      slug: `apartment-1`,
    });

    expect(slugs.length).toBeLessThan(allChildSlugs.length);

    slugs.forEach(async (slug) => {
      const id = await propertyTypeService.idForSlug({ slug });

      expect(typeof id).toBe(`number`);
    });
  });

  test(`istanbul covers slugIdMaps cache`, async () => {
    await propertyTypeService.slugForId({ id: 1 });
    await propertyTypeService.slugForId({ id: 1 });
  });
});

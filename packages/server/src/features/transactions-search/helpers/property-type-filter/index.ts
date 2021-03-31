import { PropertyTypeService } from '../../../property-type/services/property-type';

type CreatePropertyFilterInput = {
  readonly propertyTypeService: PropertyTypeService;
  readonly propertyTypes: string[];
};

type CreateAllPropertyTypeFilterInput = {
  readonly propertyTypeService: PropertyTypeService;
  readonly slug: string;
};

type Filter = {
  readonly propertyTypeId: number;
  readonly allPropertySubTypes: boolean;
  readonly propertySubTypeIds: number[];
};

const createAllPropertyTypeFilter = async ({
  propertyTypeService,
  slug,
}: CreateAllPropertyTypeFilterInput): Promise<Filter> => {
  const childSlugs = await propertyTypeService.parentSlugForSubPropertyTypeSlugs(
    {
      slug,
    }
  );

  const parentId = await propertyTypeService.idForSlug({
    slug,
  });

  const childIds = await Promise.all(
    childSlugs.map(async (childSlug) => {
      const id = await propertyTypeService.idForSlug({
        slug: childSlug,
      });

      return id;
    })
  );

  const filter = {
    propertyTypeId: parentId,
    allPropertySubTypes: true,
    propertySubTypeIds: childIds,
  };

  return filter;
};

export const createSubPropertyTypeFilter = async ({
  propertyTypeService,
  slugs,
}): Promise<Filter> => {
  const filter = await slugs.reduce(
    async (acc, nextSlug) => {
      const parentSlug = await propertyTypeService.slugForParentSlug({
        slug: nextSlug,
      });
      const parentId = await propertyTypeService.idForSlug({
        slug: parentSlug,
      });
      const childId = await propertyTypeService.idForSlug({
        slug: nextSlug,
      });

      if (acc.propertyTypeId !== null && acc.propertyTypeId !== parentId) {
        throw new Error(
          `You've attempted to create a property type filter with sub property type ids that do not have the same parent`
        );
      }

      return {
        propertyTypeId: parentId,
        allPropertySubTypes: false,
        propertySubTypeIds: [...acc.propertySubTypeIds, childId],
      };
    },
    {
      propertyTypeId: null,
      allPropertySubTypes: false,
      propertySubTypeIds: [],
    }
  );

  return filter;
};

export const createPropertyTypeFilter = async ({
  propertyTypeService,
  propertyTypes,
}: CreatePropertyFilterInput): Promise<Filter> => {
  const slug = propertyTypes[0];

  const parentSlug = await propertyTypeService.slugForParentSlug({
    slug: propertyTypes[0],
  });

  if (!parentSlug) {
    return await createAllPropertyTypeFilter({
      propertyTypeService,
      slug: propertyTypes[0],
    });
  }

  return await createSubPropertyTypeFilter({
    propertyTypeService,
    slugs: propertyTypes,
  });
};

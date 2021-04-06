const SLUG_TO_ID = {
  [`all-property-types`]: `0`,
  [`commercial`]: `-1`,
  [`office`]: `6`,
  [`office-cbd`]: `6-7`,
  [`office-sub`]: `6-8`,
  [`industrial`]: `4`,
  [`warehouse`]: `4-6`,
  [`flex`]: `4-5`,
  [`retail`]: `7`,
  [`centers`]: `7-9`,
  [`shops`]: `7-10`,
  [`apartment`]: `1`,
  [`garden`]: `1-2`,
  [`mid-highrise`]: `1-1`,
  [`hotel`]: `3`,
  [`limited-service`]: `3-4`,
  [`full-service`]: `3-3`,
  [`seniors-housing-care`]: `11`,
  [`nursing-care`]: `11-57`,
  [`seniors-housing`]: `11-56`,
  [`dev-site`]: `8`,
};

const ID_TO_SLUG = Object.entries(SLUG_TO_ID).reduce((acc, [key, value]) => {
  return {
    ...acc,
    [value]: key,
  };
}, {});

type SlugToIDResult = {
  readonly id: number;
  readonly parentId: number | null;
};

export const SLUGS = Object.keys(SLUG_TO_ID);

export const slugToId = (slug: string): SlugToIDResult => {
  const [parentId, subId] = SLUG_TO_ID[slug].split(`-`);

  return {
    id: parseInt(subId ? subId : parentId),
    parentId: subId ? parseInt(parentId) : null,
  };
};
export const idToSlug = (id: string): string => ID_TO_SLUG[id];

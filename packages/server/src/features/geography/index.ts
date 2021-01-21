import { createApp, BASE_PATH } from './apps/geography';

const geographyFeature = () => ({
  geographyBasePath: BASE_PATH,

  geographyApp() {
    return createApp();
  },
});

export type GeographyFeature = ReturnType<typeof geographyFeature>;

export const createGeographyFeature = async (): Promise<GeographyFeature> => {
  return geographyFeature();
};

import { createApp, BASE_PATH } from './apps/healthcheck';

const healtCheckFeature = () => ({
  healthCheckBasePath: BASE_PATH,

  healthCheckApp() {
    return createApp();
  },
});

export type HealthCheckFeature = ReturnType<typeof healtCheckFeature>;

export const createHealthCheckFeature = (): HealthCheckFeature =>
  healtCheckFeature();

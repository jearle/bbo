import { createApp, BASE_PATH } from './apps/ping';

const pingFeature = () => ({
  pingBasePath: BASE_PATH,

  pingApp() {
    return createApp();
  },
});

export type PingFeature = ReturnType<typeof pingFeature>;

export const createPingFeature = (): PingFeature => pingFeature();

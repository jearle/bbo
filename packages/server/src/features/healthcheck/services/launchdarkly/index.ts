import {
  HealthStatus,
  createHealthyStatus,
  createUnhealthyStatus,
} from '../../helpers/health-status';

const SERVICE_NAME = 'LaunchDarkly';

type LaunchDarklyHealthServiceInput = {
  readonly createLaunchDarklyProvider;
};

const launchDarklyHealthService = ({
  createLaunchDarklyProvider,
}: LaunchDarklyHealthServiceInput) => ({
  async health(): Promise<HealthStatus> {
    let launchDarklyProvider = null;
    try {
      launchDarklyProvider = await createLaunchDarklyProvider();
      const isClientInitialized = launchDarklyProvider.initialized();
      if (!isClientInitialized) {
        return createUnhealthyStatus(SERVICE_NAME);
      }
      return createHealthyStatus(SERVICE_NAME);
    } catch (error) {
      return createUnhealthyStatus(SERVICE_NAME);
    } finally {
      if (launchDarklyProvider) {
        await launchDarklyProvider.close();
      }
    }
  },
});

export type LaunchDarklyHealthService = ReturnType<
  typeof launchDarklyHealthService
>;

export const createLaunchDarklyHealthService = ({
  createLaunchDarklyProvider,
}: LaunchDarklyHealthServiceInput): LaunchDarklyHealthService => {
  return launchDarklyHealthService({ createLaunchDarklyProvider });
};

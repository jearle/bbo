import {
  createHealthyStatus,
  createUnhealthyStatus,
  HealthStatus,
} from '../../helpers/health-status';

const SERVICE_NAME = 'Cognito';

type CreateCognitoHealthServiceInputs = {
  readonly createCognitoProvider;
};

const cognitoHealthService = (createCognitoProvider) => ({
  async health(): Promise<HealthStatus> {
    try {
      await createCognitoProvider();
      return createHealthyStatus(SERVICE_NAME);
    } catch (error) {
      return createUnhealthyStatus(SERVICE_NAME);
    }
  },
});

export type CognitoHealthService = ReturnType<typeof cognitoHealthService>;

export const createCognitoHealthService = ({
  createCognitoProvider,
}: CreateCognitoHealthServiceInputs): CognitoHealthService => {
  return cognitoHealthService(createCognitoProvider);
};

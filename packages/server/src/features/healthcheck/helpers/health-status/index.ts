export type HealthStatus = {
  name: string;
  status: number;
  msg: string;
};

export const createHealthyStatus = (name: string): HealthStatus => ({
  name,
  status: 0,
  msg: 'ok',
});

export const createUnhealthyStatus = (name: string): HealthStatus => ({
  name,
  status: 1,
  msg: `${name} is unhealthy`,
});

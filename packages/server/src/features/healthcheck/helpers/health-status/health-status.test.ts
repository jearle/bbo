import { createHealthyStatus, createUnhealthyStatus } from './';

const SERVICE_NAME = 'TestService';

test('createHealthyStatus', () => {
  const { name, status, msg } = createHealthyStatus(SERVICE_NAME);
  expect(name).toBe(SERVICE_NAME);
  expect(status).toBe(0);
  expect(msg).toBe('ok');
});

test('createUnhealthyStatus', () => {
  const { name, status, msg } = createUnhealthyStatus(SERVICE_NAME);
  expect(name).toBe(SERVICE_NAME);
  expect(status).toBe(1);
  expect(msg).toBe(`${SERVICE_NAME} is unhealthy`);
});

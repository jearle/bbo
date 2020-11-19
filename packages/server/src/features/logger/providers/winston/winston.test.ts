import { createLogger } from '.';

test(`createLogger logType PRETTY_STRING`, () => {
  createLogger({
    logLevel: `info`,
    logType: `PRETTY_STRING`,
  });
});

test(`createLogger logType JSON`, () => {
  createLogger({
    logLevel: `info`,
    logType: `JSON`,
  });
});

test(`createLogger logType PRETTY_STRING`, () => {
  const logType: any = `FAKE`;

  expect(() =>
    createLogger({
      logLevel: `info`,
      logType,
    })
  ).toThrow();
});

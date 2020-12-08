import { prettyStringFormat } from './pretty-string-format';

test(`prettyStringFormat`, () => {
  const { template } = prettyStringFormat();

  const log = template({ timestamp: `foo`, level: `info`, message: `hello` });

  expect(log).toMatch(/foo*.*info*.*hello/);
});

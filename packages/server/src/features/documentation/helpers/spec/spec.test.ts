import { createSpec } from '.';

/**
 * @swagger
 *
 * /spec-test:
 *   get:
 *     description: a spec test
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: a spect test
 */

test(`createSpec`, () => {
  const apiPaths = [`${__dirname}/*.ts`];

  const spec = createSpec({
    title: `createSpec Test`,
    description: `bar`,
    version: `v0`,
    apiPaths,
  });

  expect(spec.paths[`/spec-test`]).not.toBeUndefined();
});

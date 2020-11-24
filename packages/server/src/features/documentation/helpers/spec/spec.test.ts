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
  const spec = createSpec({
    feature: `documentation`,
    description: `bar`,
    host: `localhost`,
    port: 8080,
    basePath: `/foo/bar`,
  });

  expect(spec.paths[`/spec-test`]).not.toBeUndefined();
});

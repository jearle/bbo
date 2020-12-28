import * as express from 'express';
import { json } from 'body-parser';
import { fetchTextOnRandomPort } from 'shared/dist/helpers/express/listen-fetch';
import { targetHandlerMiddleware } from '.';

test(`targetHandlerMiddleware`, async () => {
  const app = express();
  app.use(json());

  const handlers = {
    foo({ body }) {
      return body.foo;
    },
  };

  app.use(
    targetHandlerMiddleware({
      handlers,
    })
  );

  app.post(`/`, (req, res) => {
    const foo = req.handler(req);

    res.send(foo);
  });

  const text = await fetchTextOnRandomPort(app, {
    method: `POST`,
    headers: {
      [`x-amz-target`]: `amz.Foo`,
      [`content-type`]: `application/json`,
    },
    body: JSON.stringify({ foo: `bar` }),
  });

  expect(text).toBe(`bar`);
});

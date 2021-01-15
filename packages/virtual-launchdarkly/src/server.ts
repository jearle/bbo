import * as express from 'express';
import { json } from 'body-parser';
import { createServer } from 'http';
import { AddressInfo } from 'net';

type StartServerInputs = {
  readonly host: string;
  readonly port: number;
};

export const startServer = async ({
  host,
  port,
}: StartServerInputs): Promise<void> => {
  // features

  // end features
  const mounts = express();
  mounts.use(json());
  mounts.use((req, res, next) => {
    // console.log(`METHOD`, req.method);
    // console.log(`URL`, req.url);
    // console.log(`HEADERS`, req.headers);
    // console.log(`BODY`, req.body);
    // console.log(`PARAMS`, req.params);

    next();
  });

  mounts.post(`/diagnostic`, (req, res) => {
    // console.log(`DIAGNOSTIC`);
    res.set(`date`, new Date().toUTCString());
    res.set(`content-type`, `application/json`);
    res.set(`strict-transport-security`, `max-age=31536000`);
    res.status(202);
    res.send();
  });

  mounts.get(`/all`, (req, res) => {
    console.log(`ALL`);
    const headers = {
      date: new Date().toUTCString(),
      'content-type': 'text/event-stream; charset=utf-8',
      'transfer-encoding': 'chunked',
      connection: 'close',
      'accept-ranges': 'bytes',
      'cache-control': 'no-cache, no-store, must-revalidate',
      'ld-region': 'us-east-1',
      'strict-transport-security': 'max-age=31536000, max-age=31536000',
    };

    Object.entries(headers).forEach(([key, value]) => {
      res.set(key, value);
    });

    const data = {
      path: '/',
      data: {
        segments: {},
        flags: {
          'ff-debug-test-false': {
            key: 'ff-debug-test-false',
            on: false,
            fallthrough: { variation: 1 },
            offVariation: 1,
            variations: [true, false],
          },
          'ff-debug-test-true': {
            key: 'ff-debug-test-true',
            on: true,
            fallthrough: { variation: 0 },
            offVariation: 1,
            variations: [true, false],
          },
          'ff-release-api-27-set-up-launch-darkly': {
            key: 'ff-release-api-27-set-up-launch-darkly',
            on: false,
            fallthrough: { variation: 0 },
            offVariation: 1,
            variations: [true, false],
          },
        },
      },
    };
    const responseString = `event: put
data: ${JSON.stringify(data)}

`;

    res.write(responseString);
    res.status(200);
    res.end();
  });

  // start server
  const server = createServer(mounts);
  server.listen(port, host, () => {
    const addressInfo = server.address() as AddressInfo;

    const host = addressInfo.address;

    console.log(`info`, `listening: http://${host}:${addressInfo.port}`);
  });
};

import { createServer } from 'http';
import { closeServer } from './close-server';

describe(`closeServer`, () => {
  test(`closeServer`, async () => {
    const server = createServer();

    server.listen(0);
    expect(server.listening).toBe(true);
    await closeServer(server);
    expect(server.listening).toBe(false);
  });
});

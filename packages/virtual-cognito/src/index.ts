import { startServer } from './server';

const { HOST: host, PORT } = process.env;
const port = parseInt(PORT);

startServer({
  host,
  port,
});

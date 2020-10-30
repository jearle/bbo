import { startServer } from './server';

const {
  PORT,
  HOST: host
} = process.env;

const port = parseInt(PORT);

startServer({ port, host });

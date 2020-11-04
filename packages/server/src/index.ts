import { startServer } from './server';

const { PORT, HOST: host } = process.env;
console.log(process.env);
const port = parseInt(PORT);

startServer({ port, host });

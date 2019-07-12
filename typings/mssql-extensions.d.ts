


import * as Hapi from '@hapi/hapi';
import { ConnectionPool, config } from 'mssql';

declare module 'mssql'{
  export interface SqlError {
    name: string;
    code: string;
    message: string;
  }

  export interface ConnectionPool  {
    on(event: 'error', listener: (err: SqlError) => void): this;
    new (config: config ) : ConnectionPool;
  }
}
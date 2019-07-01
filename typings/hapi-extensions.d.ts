import * as Hapi from '@hapi/hapi';
import { ConnectionPool } from 'mssql';

declare module '@hapi/hapi'{
  export interface ServerApplicationState {
    dbs: {
      rcaweb: ConnectionPool;
    }  
  }
}
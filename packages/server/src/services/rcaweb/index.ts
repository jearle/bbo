const sql = require("mssql");

export interface SqlOptions {
  "dbRcaWebAccounts": {
    "user": String,
    "password": String,
    "database": String,
    "server": String,
    "connectionTimeout": Number,
    "pool": {
      "max": Number
      "min": Number
      "idleTimeoutMillis": Number
    }
  }
}

export const createRCAWebDB = async (config : SqlOptions) => {
    let pool = await sql.connect(config.dbRcaWebAccounts);
    
    return pool;
};

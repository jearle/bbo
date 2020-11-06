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

export const createRCAWebDB = (config : SqlOptions) => {
  sql.connect(config, function (err) {
        if (err) throw Error(err)
        
        return sql;
    });
};

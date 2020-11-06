const sql = require('mssql');

interface PermissionsMiddlewareOptions {
  permissionsService: any;
}

export const createPermissionsMiddleware = ({
  permissionsService,
}: PermissionsMiddlewareOptions) => {
  return async (req, res, next) => {
    // Mocked values, we need to get the id from the req object and the type of search params decides what sp to use
    let userid = 130436;
    let sp = 'ReturnStateProvAndCountryPTsByUser_New_PTSMenu';
    let key = `${userid}_${sp}`;

    const userPermissionModel = await redisClient.get(key);

    // if (
    //   typeof userPermissionModel === 'undefined' ||
    //   userPermissionModel === null
    // ) {
    //   rCAWebDBClient
    //     .then((pool) => {
    //       pool
    //         .request()
    //         .input('AccountUser_id', sql.Int, userid)
    //         .execute(sp, async (err, result) => {
    //           if (err) {
    //             console.log('Sql.Request Error for Permissions Model ', userid);
    //             console.log(err);
    //             next();
    //           }
    //           const permissionsModel = result.recordsets[0];
    //           await redisClient.set(key, JSON.stringify(permissionsModel));
    //         });
    //     })
    //     .catch((err) => {
    //       console.log('error:', err);
    //       next();
    //     });
    // }

    next();
  };
};

export const checkUserPermissionModel = (rCAWebDBClient) => {
    
    const dbClient = rCAWebDBClient;

    return (req, res, next) => {
        // Check redis
        // const request = new dbClient.Request();
        // request.input('AccountUser_id', dbClient.Int, 125);
        // request.execute('ReturnStateProvAndCountryPTsByUser_New_PTSMenu', function (err: any, recordsets: any) {
        //   if (err) {
        //     console.log('Sql.Request Error for Permissions Model ' + 125);
        //     console.log(err);
        //   }
        //   const permissionsModel = recordsets[0];
        //   console.log(permissionsModel)
        //   //Update redis
        //   next();
        // });
        console.log("test")
    }
  }
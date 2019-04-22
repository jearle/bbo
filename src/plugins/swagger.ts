
import * as Hapi from 'hapi';
const HapiSwagger = require( 'hapi-swagger' );
const Package = require('./../../package');

const Swagger : Hapi.ServerRegisterPluginObject<any> = {
    options: {
        info: {
            title: 'RCA API Documentation',
            version: Package.version,
        },
    },
    plugin: HapiSwagger
};

export default Swagger;
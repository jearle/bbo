import { Server, ServerRoute } from '@hapi/hapi';
import * as Inert from '@hapi/inert';
import * as Vision from '@hapi/vision';
import * as Jwt from 'hapi-auth-jwt2';
import dbs from './dbs';
import env from './env';
import { auth } from './plugins/auth-cognito';
import Swagger from './plugins/swagger';
import routes from './routes';

const init = async () => {
	const server = new Server({
		host: env.API_HOST,
		port: env.API_PORT,
	});

	await server.register([Jwt, Inert, Vision, Swagger] as any);

	auth(server);

	await dbs.initialize(server);

	server.route(routes as ServerRoute[]);

	await server.initialize();
	return server;
};

export { init };

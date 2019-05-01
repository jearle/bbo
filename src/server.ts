/* tslint:disable:object-literal-sort-keys */
import { Server, ServerRoute } from 'hapi';
import * as Inert from 'inert';
import * as Vision from 'vision';
import env from './env';
import { auth, Jwt } from './plugins/auth';
import Swagger from './plugins/swagger';
import routes from './routes';

const init = async (start = true) => {
	const server = new Server({
		host: env.API_HOST,
		port: env.API_PORT,
	});

	await server.register([Jwt, Inert, Vision, Swagger] as any);

	await auth(server);

	server.route(routes as ServerRoute[]);

	if (start) {
		await server.start();

		// tslint:disable-next-line:no-console
		console.log(`Server running at: ${server.info.uri}`);
	} else {
		await server.initialize();
	}

	return server;
};

export { init };

import * as Hapi from 'hapi';
import * as Inert from 'inert';
import * as Vision from 'vision';
import env from './env';
import Swagger from './plugins/swagger';
import routes from './routes';

const init = async (start = true) => {
	const server = new Hapi.Server({
		host: env.API_HOST,
		port: env.API_PORT,
	});

	await server.register([Inert, Vision, Swagger] as any);

	server.route(routes);

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

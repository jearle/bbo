import * as Hapi from 'hapi';
import env from './env';
import routes from './routes';

const init = async () => {
	const server = new Hapi.Server({
		host: env.API_HOST,
		port: env.API_PORT,
	});

	server.route(routes);

	await server.start();

	// tslint:disable-next-line:no-console
	console.log(`Server running at: ${server.info.uri}`);

	return server;
};

export { init };

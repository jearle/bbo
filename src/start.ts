import { init } from './server';

export default (async () => {
	const server = await init();
	await server.start();

	// tslint:disable-next-line:no-console
	console.log(`Server running at: ${server.info.uri}`);
	return server;
})();

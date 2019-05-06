import HelloController from './controllers/hello-controller';
import PrivateController from './controllers/private-controller';

export default [
	{
		method: 'GET',
		options: {
			handler: HelloController.get,
			tags: ['api'],
		},
		path: '/hello',
	},
	{
		method: 'GET',
		options: {
			auth: 'jwt',
			handler: PrivateController.get,
			tags: ['api'],
		},
		path: '/private',
	},
];

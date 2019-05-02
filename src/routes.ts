import HelloController from './controllers/hello-controller';
import PrivateController from './controllers/private-controller';

export default [
	{
		method: 'GET',
		options: {
			auth: false,
			handler: HelloController.get,
			tags: ['api'],
		},
		path: '/hello',
	},
	{
		method: 'GET',
		options: {
			handler: PrivateController.get,
			tags: ['api'],
		},
		path: '/private',
	},
];

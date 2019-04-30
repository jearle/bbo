/* tslint:disable:object-literal-sort-keys */
import HelloController from './controllers/hello-controller';
import PrivateController from './controllers/private-controller';

export default [
	{
		path: '/hello',
		method: 'GET',
		options: {
			handler: HelloController.get,
			tags: ['api'],
		},
	},
	{
		path: '/private',
		method: 'GET',
		options: {
			auth: 'jwt',
			handler: PrivateController.get,
			tags: ['api'],
		},
	},
];

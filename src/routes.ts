/* tslint:disable:object-literal-sort-keys */
import HelloController from './controllers/hello-controller';
import PrivateController from './controllers/private-controller';

export default [
	{
		path: '/hello',
		method: 'GET',
		options: {
			auth: false,
			handler: HelloController.get,
			tags: ['api'],
		},
	},
	{
		path: '/private',
		method: 'GET',
		options: {
			handler: PrivateController.get,
			tags: ['api'],
		},
	},
];

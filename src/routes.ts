import HelloController from './controllers/hello-controller';

export default [
	{
		method: 'GET',
		options: {
			handler: HelloController.get,
			tags: ['api'],
		},
		path: '/hello',
	},
];

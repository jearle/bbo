import HelloController from './controllers/hello-controller';

export default [
	{
		handler: HelloController.get,
		method: 'GET',
		path: '/hello',
	},
];

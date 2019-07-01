import { ServerRoute } from '@hapi/hapi';
import * as Joi from '@hapi/joi';
import CompanyBulletsController from './controllers/company-bullets-controller';

const tags = ['api'];

const routes: ServerRoute[] = [
	{
		method: 'GET',
		options: {
			handler: CompanyBulletsController.get,
			plugins: {
				camelize: true,
			},
			response: {
				modify: true,
				schema: Joi.array()
					.items(
						Joi.object({
							bullet_id: Joi.number(),
							bullet_tx: Joi.string(),
						})
					)
					.options({ stripUnknown: true }),
			},
			tags,
			validate: {
				params: {
					id: Joi.string()
						.guid()
						.required(),
				},
			},
		},
		path: '/api/company/{id}/bullets',
	},
];

export default routes;

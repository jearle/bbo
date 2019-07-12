import { RouteOptions } from '@hapi/hapi';
import routes from '../src/routes';

describe('routes', () => {
	describe('tags', () => {
		it('contains api or internal', () => {
			// NOTE: Any end points tagged with API will be exposed in the
			// swagger documentation via baseurl/documentation.  Internal
			// tag is used indicate this route is should not be known to public
			routes.forEach(route => {
				const options = route.options as RouteOptions;
				const hasApi = options.tags.indexOf('api') !== -1;
				const hasInternal = options.tags.indexOf('internal') !== -1;
				expect(hasApi || hasInternal).toBeTruthy();
			});
		});
	});
});

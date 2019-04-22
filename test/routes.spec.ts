import routes from '../src/routes';

describe('routes', () => {
    
    describe( 'tags', () => {
        it('contains api or internal', () => {

            // NOTE: Any end points tagged with API will be exposed in the
            // swagger documentation via baseurl/documentation.  Internal
            // tag is used indicate this route is should not be known to public
            routes.forEach( 
                route => {
                    const hasApi = route.options.tags.indexOf( 'api' ) !== -1;
                    const hasInternal = route.options.tags.indexOf( 'internal' ) !== -1;
                    expect( hasApi || hasInternal ).toBeTruthy();
                }
            )
        })
    })
});

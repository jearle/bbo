
<a href="https://app.rcanalytics.com"><img src="https://app.rcanalytics.com/assets/images/logo/logoRealCap.svg" width="400px"/></a>

----

## Prerequisites

* [Docker Community Edition](https://www.docker.com/products/docker-engine)
* [yarn](https://yarnpkg.com/en/docs/install)
* .env file

## Development Workflow
 - Get a .env from a team member and drop into project root
 - `yarn dc:up`
 - `yarn dev`

## Scripts
 - `yarn build`
   - Transpiles the src + test folders' typescript into dist
   - 
 - `yarn dc`
   - Shortcut to docker-compose -f .... - this is utility helper other docker commands are built on top of
   - 
 - `yarn dc:up`
   - Creates a developer environment via docker. The first time this may take a few minutes as your system will pull the node image and run install node_modules.  Note: node_modules will be cached to the yarn volume so subsequent installs are fast.
   - 
 - `yarn dev`
   - Starts the local dev server with file watching to trigger restarts. This also checks that your node_modules folder matches the expected dependency tree (ie switching branches). 
   - 
 - `yarn format`
   - Prettifies src + test code to keep consistent style between developers.
   - 
 - `yarn lint`
   - Runs tslint to check for any problems
   - 
 - `yarn precommit`
   - Git precommit hook that automatically runs before any code is committed.  This is used locally for developers to catch lint/formatting issues before builds fail on the CI environment.
   - 
 - `yarn start`
   - Executes the server built in the distribution folder
   - 
 - `yarn test`
   - Runs the unit tests within test folder

## Notes
 - We are using yarn rather than npm. Please do not stray from this. [See here](https://yarnpkg.com/lang/en/docs/) for docs/cli commands
 - 
 - Bash history is automatically copied from your local to docker container

## Gotchas
 - dev environment variables are loaded when `yarn dc:up` is executed. If you need to change them, then you should modify the .env, exit out of container and reenter.

 - corrupt node_modules folder. If this happens you should delete the yarn volume used to cache all the dependencies by exiting the container and running `docker volume rm dev_yarn`
  
 - `yarn precommit` this automatically restages any files that where changed and modified via format update. If you have any unstaged changes in the file it will automatically be added so you'll want to stash these.

## Tests
 - Our goal is 100% coverage. Please don't lower it - find a way to test it.  If it's vendors code, then mark it to be ignore.

## Deployment
 - These are handled through bamboo. dev environment is a true 'CI' environment where any commit will be built + autodeployed. All other environments operate on an request or scheduled basis.
  
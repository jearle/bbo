# cd-product-api

## MacOS Local Development Quick Start
Copy and paste the following into Terminal:

```sh
git clone git@github.com:rcanalytics/cd-product-api.git
cd cd-product-api
git checkout develop
nvm use
yarn install
cd packages/server
yarn start
```

## Build Production
```sh
yarn build:server:production
```

## packages/

+ [server/](https://github.com/rcanalytics/cd-product-api/tree/develop/packages/server)
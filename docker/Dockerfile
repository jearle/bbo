FROM node:10-alpine

#add bash
RUN apk update
RUN apk upgrade
RUN apk add bash

# used for writing .npmrc
ARG bamboo_NPM_AUTH_TOKEN

# specify the working directory
WORKDIR /usr/app/

# write npm registry auth token for private packages
RUN echo $'registry=https://registry.npmjs.org/\n//registry.npmjs.org/:_authToken='$bamboo_NPM_AUTH_TOKEN > /usr/app/.npmrc

COPY package.json yarn.lock ./

RUN yarn install --no-cache --frozen-lockfile --production

COPY src /usr/app/src
COPY test /usr/app/test
COPY .prettierrc /usr/app/.prettierrc
COPY jest.config.js /usr/app/jest.config.js
COPY tsconfig.json /usr/app/tsconfig.json
COPY tslint.json /usr/app/tslint.json

RUN yarn build

RUN yarn lint

RUN yarn format:test

RUN yarn test

CMD ["yarn", "start"]

# app runs on port 7777
EXPOSE 7777

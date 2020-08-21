FROM node:10-alpine

#add bash
RUN apk update
RUN apk upgrade
RUN apk add bash

# specify the working directory
WORKDIR /usr/app/

COPY package.json yarn.lock ./

COPY src /usr/app/src
COPY test /usr/app/test
COPY typings /usr/app/typings
COPY .prettierrc /usr/app/.prettierrc
COPY jest.config.js /usr/app/jest.config.js
COPY tsconfig.json /usr/app/tsconfig.json
COPY tslint.json /usr/app/tslint.json

CMD ["yarn", "start"]

# app runs on port 8000
EXPOSE 8000


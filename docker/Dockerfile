FROM node:10-alpine

#add bash
RUN apk update
RUN apk upgrade
RUN apk add bash

# specify the working directory
WORKDIR /usr/app/

# copy global node resources
COPY node_modules/ ./node_modules
COPY package.json yarn.lock ./

COPY dist/ ./dist

CMD ["yarn", "start"]

# app runs on port 8000
EXPOSE 8000


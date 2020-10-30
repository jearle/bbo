FROM node:15-alpine3.10

RUN apk update
RUN apk upgrade
RUN apk add bash

WORKDIR /usr

COPY node_modules/ /usr/node_modules
COPY packages/ /usr/packages

EXPOSE 8080

STOPSIGNAL SIGTERM

CMD ["node", "packages/server/dist/index.js"]
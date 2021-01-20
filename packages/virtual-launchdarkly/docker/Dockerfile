FROM node:15-alpine

WORKDIR /app

COPY ./cd-product-api /app

RUN yarn install \
  && cd /app/packages/shared \
  && yarn build:production \
  && cd /app/packages/virtual-launchdarkly \
  && yarn build:production

EXPOSE 20204

ENV HOST=0.0.0.0
ENV PORT=20204

STOPSIGNAL SIGTERM

ENTRYPOINT [ "node", "/app/packages/virtual-launchdarkly/dist/index" ]
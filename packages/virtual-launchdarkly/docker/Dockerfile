FROM node:15-alpine

WORKDIR /app

COPY ./cd-product-api /app

RUN yarn install \
  && cd /app/packages/shared \
  && yarn build:production \
  && cd /app/packages/virtual-launchdarkly \
  && yarn build:production

EXPOSE 10203

ENV HOST=0.0.0.0
ENV PORT=10203

STOPSIGNAL SIGTERM

ENTRYPOINT [ "node", "/app/packages/virtual-launchdarkly/dist/index" ]
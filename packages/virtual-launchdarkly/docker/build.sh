#!/usr/bin/env bash

docker login

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

die () {
    echo >&2 "$@"
    exit 1
}

echo "Remove cd-product-api files"
rm -rf $DIR/cd-product-api

echo "making cd-product-api/packages"
mkdir -p $DIR/cd-product-api/packages
RSYNC="rsync \
  --archive \
  --progress \
  --exclude=node_modules \
  --exclude=docker \
  --exclude=dist \
  --exclude=coverage \
  --exclude=.env"

echo "Copying cd-product-api package.json"
$RSYNC $DIR/../../../package.json $DIR/cd-product-api/package.json

echo "Copying cd-product-api yarn.lock"
$RSYNC $DIR/../../../yarn.lock $DIR/cd-product-api/yarn.lock

echo "Copying shared"
$RSYNC $DIR/../../shared $DIR/cd-product-api/packages

echo "Copying virtual launchdarkly"
$RSYNC $DIR/.. $DIR/cd-product-api/packages/virtual-launchdarkly

DOCKER_TAG="rcanalytics/product-api-virtual-launchdarkly:latest"

echo "Removing $DOCKER_TAGE"
docker rmi -f $DOCKER_TAG

echo "Building $DOCKER_TAGE"
docker build --no-cache -t $DOCKER_TAG .

echo "Pushing $DOCKET_TAG"
docker push $DOCKER_TAG

echo "Remove cd-product-api files"
rm -rf $DIR/cd-product-api

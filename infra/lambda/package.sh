#!/bin/bash

set -e

npm run build

cp package.json dist

cd dist

npm install --only=prod

zip -r package.zip .
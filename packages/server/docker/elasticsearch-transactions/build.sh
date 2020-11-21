#!/usr/bin/env bash

docker login

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

die () {
    echo >&2 "$@"
    exit 1
}

[ "$#" -eq 1 ] || die "path to transactions.ndjson required"
[ -f "$1" ] || die "$1 does not exist"

BACKUP_SOURCE=$1
LOCAL_SOURCE=$DIR/transactions.ndjson

echo "Copying..."
echo ""
echo "Backup Source: $BACKUP_SOURCE"
echo " Local Source: $LOCAL_SOURCE"
echo ""
rsync --human-readable --progress $BACKUP_SOURCE $LOCAL_SOURCE

docker build --no-cache -t rcanalytics/product-api-elasticsearch-transactions:latest .

docker push rcanalytics/product-api-elasticsearch-transactions:latest

rm -rf $LOCAL_SOURCE
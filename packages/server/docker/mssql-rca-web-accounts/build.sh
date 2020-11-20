#!/usr/bin/env bash

docker login

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

die () {
    echo >&2 "$@"
    exit 1
}

[ "$#" -eq 1 ] || die "path to dbRCAWebAccounts.bak required"
[ -f "$1" ] || die "$1 does not exist"

BACKUP_SOURCE=$1
LOCAL_SOURCE=$DIR/dba-rca-web-accounts.bak

echo "Copying..."
echo ""
echo "Backup Source: $BACKUP_SOURCE"
echo " Local Source: $LOCAL_SOURCE"
echo ""
rsync --human-readable --progress $BACKUP_SOURCE $LOCAL_SOURCE

docker build --no-cache -t rcanalytics/product-api-mssql-rca-web-accounts:latest .

# docker push rcanalytics/mssql-rca-web-accounts:latest

rm -rf $LOCAL_SOURCE
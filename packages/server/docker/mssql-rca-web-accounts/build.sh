#!/usr/bin/env bash

docker login

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

die () {
    echo >&2 "$@"
    exit 1
}

[ "$#" -eq 1 ] || die "path to dbRCAWebAccounts.bak required"
[ -f "$1" ] || die "$1 does not exist"

FILENAME=$1
DESTINATION=$DIR/dba-rca-web-accounts.bak

echo "Copying..."
echo ""
echo "Backup Source: $FILENAME"
echo "  Destination: $DESTINATION"
echo ""
# rsync --human-readable --progress $FILENAME $DESTINATION

docker build --no-cache -t rcanalytics/mssql-rca-web-accounts:latest .

docker push rcanalytics/mssql-rca-web-accounts:latest

rm -rf $DESTINATION
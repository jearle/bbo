#!/bin/sh
echo "Adding data"

curl $DATA_URL --output transactions.ndjson

curl -s -H "Content-Type: application/x-ndjson" -XPOST http://localhost:9200/test7_multi_pst/_bulk --data-binary @/transactions.ndjson
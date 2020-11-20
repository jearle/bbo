FROM elasticsearch:7.9.3

COPY ./transactions.ndjson /tmp/data/

RUN /usr/local/bin/docker-entrypoint.sh elasticsearch -d -E "discovery.type=single-node" \
  && while [[ "$(curl -s -o /dev/null -w '%{http_code}' localhost:9200)" != "200" ]]; do date; sleep 1; done \
  && curl http://localhost:9200/test7_multi_pst \
  && sleep 1 \
  && curl -s -H "Content-Type: application/x-ndjson" -X POST http://localhost:9200/test7_multi_pst/_bulk --data-binary @/tmp/data/transactions.ndjson

FROM elasticsearch:7.9.3 AS builder
ADD preload.sh transactions.ndjson /
RUN /usr/local/bin/docker-entrypoint.sh elasticsearch -d -E path.data=/tmp/data -E "discovery.type=single-node" \
    && while [[ "$(curl -s -o /dev/null -w '%{http_code}' localhost:9200)" != "200" ]]; do sleep 1; done \
    && /preload.sh

FROM elasticsearch:7.9.3
COPY --from=builder /tmp/data/ /usr/share/elasticsearch/data/
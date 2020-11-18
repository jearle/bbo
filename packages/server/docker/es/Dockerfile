FROM elasticsearch:7.9.3 AS builder

ENV DATA_URL=http://url.to.data

ADD preload.sh /
RUN /usr/local/bin/docker-entrypoint.sh elasticsearch -d -E path.data=/tmp/data -E "discovery.type=single-node" \
    && while [[ "$(curl -s -o /dev/null -w '%{http_code}' localhost:9200)" != "200" ]]; do sleep 1; done \
    && /preload.sh

FROM elasticsearch:7.9.3
COPY --from=builder /tmp/data/ /usr/share/elasticsearch/data/
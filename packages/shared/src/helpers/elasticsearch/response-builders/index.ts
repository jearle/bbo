import { EsClientRawResponse } from "../../types/elasticsearch";

export const getElasticHits = (response: EsClientRawResponse) => {
  const { hits } = response.body.hits;
  return hits.map(({ _source }) => {
    return _source;
  });
};

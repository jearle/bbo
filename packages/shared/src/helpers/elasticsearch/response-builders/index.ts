import { EsClientRawResponse } from "../../types/elasticsearch";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getElasticHits = (response: EsClientRawResponse): any[] => {
  const { hits } = response.body.hits;
  return hits.map(({ _source }) => {
    return _source;
  });
};

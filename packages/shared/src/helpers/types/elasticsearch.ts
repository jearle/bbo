export type ElasticQuery = {
  _source?: string[];
  fields?: string[];
  script_fields?: unknown;
  query?: unknown;
  size?: number;
  aggs?: unknown;
  sort?: unknown;
  from?: unknown;
  highlight?: unknown;
};

export type EsClientRawResponse = {
  body?: unknown;
  statusCode?: number;
  headers?: unknown;
  meta?: unknown;
};

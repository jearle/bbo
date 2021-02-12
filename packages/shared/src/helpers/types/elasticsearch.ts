/* eslint-disable */
export type ElasticQuery = {
  _source?: string[];
  fields?: string[];
  script_fields?: any;
  query?: any;
  size?: number;
  aggs?: any;
  sort?: any;
  from?: any;
  highlight?: any;
};

export type EsClientRawResponse = {
  body?: any;
  statusCode?: number;
  headers?: any;
  meta?: any;
};

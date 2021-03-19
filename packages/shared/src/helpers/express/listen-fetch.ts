import { Application } from 'express';
import { AddressInfo } from 'net';
import fetch from 'node-fetch';
import { Response } from 'node-fetch';
import { portListen } from './port-listen';

type FetchOnRandomPortOptions = {
  readonly path?: string;
  readonly method?: string;
  readonly query?: string;
  readonly body?: string;
  readonly headers?: { [key: string]: string };
};

export const fetchResponseOnRandomPort = async (
  app: Application,
  {
    path = `/`,
    method = `GET`,
    query = ``,
    body = null,
    headers,
  }: FetchOnRandomPortOptions = {}
): Promise<Response> => {
  const server = await portListen(app);
  const { port } = server.address() as AddressInfo;

  const queryString = query.length > 0 ? `?${query}` : ``;
  const response = await fetch(
    `http://localhost:${port}${path}${queryString}`,
    { method, headers, body }
  );

  server.close();

  return response;
};

export const fetchTextOnRandomPort = async (
  app: Application,
  { path, method, query, body, headers }: FetchOnRandomPortOptions = {}
): Promise<string> => {
  const response = await fetchResponseOnRandomPort(app, {
    path,
    method,
    query,
    body,
    headers,
  });

  const text = await response.text();

  return text;
};

export const fetchJSONOnRandomPort = async (
  app: Application,
  { path, method, query, body, headers }: FetchOnRandomPortOptions = {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
  const response = await fetchResponseOnRandomPort(app, {
    path,
    method,
    query,
    body,
    headers,
  });

  const json = await response.json();

  return json;
};

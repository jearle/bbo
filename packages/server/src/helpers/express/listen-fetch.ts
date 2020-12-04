import { Application } from 'express';
import * as fetch from 'node-fetch';
import { portListen } from './port-listen';
import { Response } from 'node-fetch';

type FetchOnRandomPortOptions = {
  readonly path?: string;
  readonly query?: string;
};

export const fetchResponseOnRandomPort = async (
  app: Application,
  { path = `/`, query = `` }: FetchOnRandomPortOptions = {}
): Response => {
  const server = await portListen(app);
  const { port } = server.address();

  const queryString = query.length > 0 ? `?${query}` : ``;
  const response = await fetch(`http://localhost:${port}${path}${queryString}`);

  server.close();

  return response;
};

export const fetchTextOnRandomPort = async (
  app: Application,
  { path = `/`, query = `` }: FetchOnRandomPortOptions = {}
): Promise<string> => {
  const response = await fetchResponseOnRandomPort(app, { path, query });

  const text = await response.text();

  return text;
};

export const fetchJSONOnRandomPort = async (
  app: Application,
  { path = `/`, query = `` }: FetchOnRandomPortOptions = {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
  const response = await fetchResponseOnRandomPort(app, { path, query });

  const json = await response.json();

  return json;
};

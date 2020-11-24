import * as fetch from 'node-fetch';
import { portListen } from './port-listen';

export const fetchResponseOnRandomPort = async (
  app,
  { path = `/`, query = `` } = {}
) => {
  const server = await portListen(app);
  const { port } = server.address();

  const queryString = query.length > 0 ? `?${query}` : ``;
  const response = await fetch(`http://localhost:${port}${path}${queryString}`);

  server.close();

  return response;
};

export const fetchTextOnRandomPort = async (
  app,
  { path = ``, query = `` } = {}
) => {
  const response = await fetchResponseOnRandomPort(app, { path, query });

  const text = await response.text();

  return text;
};

export const fetchJSONOnRandomPort = async (
  app,
  { path = ``, query = `` } = {}
) => {
  const response = await fetchResponseOnRandomPort(app, { path, query });

  const json = await response.json();

  return json;
};

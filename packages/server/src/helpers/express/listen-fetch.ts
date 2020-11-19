import * as fetch from 'node-fetch';
import { portListen } from './port-listen';

export const fetchResponseOnRandomPort = async (app, { path = `/` } = {}) => {
  const server = await portListen(app);
  const { port } = server.address();

  const response = await fetch(`http://localhost:${port}`);

  server.close();

  return response;
};

export const fetchTextOnRandomPort = async (app, { path = `` } = {}) => {
  const response = await fetchResponseOnRandomPort(app, { path });

  const text = await response.text();

  return text;
};

export const fetchJSONOnRandomPort = async (app, { path = `` } = {}) => {
  const response = await fetchResponseOnRandomPort(app, { path });

  const json = await response.json();

  return json;
};

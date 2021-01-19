import { getAllData } from './data';

const createResponseString = (data): string => `event: put
data: ${JSON.stringify(data)}

`;

export const getAllDataResponse = (): string => {
  const data = getAllData();
  const response = createResponseString(data);

  return response;
};

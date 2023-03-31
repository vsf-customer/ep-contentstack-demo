import fetch, { Response } from 'node-fetch';
import getHeaders from './getHeaders';

const client = async <T = Response>(request: {
  method: 'GET' | 'POST' | 'DELETE' | 'PUT';
  body?: any;
  slug: string;
}): Promise<T> => {
  const { method, body, slug } = request;
  const headers = await getHeaders();
  const response = await fetch(`https://api.moltin.com/${slug}`, {
    method,
    body: JSON.stringify(body),
    headers
  });
  return await response.json();
};

export default client;

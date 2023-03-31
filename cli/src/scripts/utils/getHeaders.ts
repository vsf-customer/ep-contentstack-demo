import fetch, { HeadersInit } from 'node-fetch';
import 'dotenv/config';

const getAccessToken = async () => {
  if (!process.env.EPCC_CLIENT_ID || !process.env.EPCC_CLIENT_SECRET) {
    throw new Error(
      'You must provide client ID and client secret variable values in the .env file.'
    );
  }

  const params = new URLSearchParams();
  params.append('client_id', process.env.EPCC_CLIENT_ID);
  params.append('client_secret', process.env.EPCC_CLIENT_SECRET);
  params.append('grant_type', 'client_credentials');

  const response = await fetch('https://api.moltin.com/oauth/access_token', {
    method: 'POST',
    body: params,
    headers: {
      accept: 'application/json',
      'content-type': 'text/plain'
    }
  });

  const { access_token: accessToken, errors } = await response.json();
  if (errors) {
    throw new Error(JSON.stringify(errors, null, 2));
  }

  return accessToken;
};

const getHeaders = async (): Promise<HeadersInit> => ({
  Authorization: `Bearer ${await getAccessToken()}`,
  accept: 'application/json',
  'content-type': 'application/json'
});

export default getHeaders;

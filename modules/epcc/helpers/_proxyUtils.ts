import { IncomingMessage } from 'node:http';
import { Context as NuxtContext } from '@nuxt/types';
import merge from 'lodash.merge';
import { IntegrationConfig } from '@/types/core';
import isHTTPS from 'is-https';

export type ApiClientMethod = (...args: any) => Promise<any>;

interface CreateProxiedApiParams {
  givenApi: Record<string, ApiClientMethod>;
  client: any;
  tag: string;
}

export const getBaseUrl = (
  req: IncomingMessage,
  basePath: string | undefined = '/'
): string => {
  if (!req) return `${basePath}api/`;
  const { headers } = req;
  const isHttps = isHTTPS(req);
  const scheme = isHttps ? 'https' : 'http';
  const host = headers['x-forwarded-host'] || headers.host;

  return `${scheme}://${host}${basePath}api/`;
};

export const createProxiedApi = ({
  givenApi,
  client,
  tag
}: CreateProxiedApiParams): ProxyHandler<any> =>
  new Proxy(givenApi, {
    get: (target, prop, receiver) => {
      const functionName = String(prop);
      if (Reflect.has(target, functionName)) {
        return Reflect.get(target, prop, receiver);
      }

      // eslint-disable-next-line @typescript-eslint/require-await
      return async (...args) =>
        client.post(`/${tag}/${functionName}`, args).then((r) => r.data);
    }
  });

export const getHTTPRequestCookies = (context: NuxtContext): string =>
  context?.req?.headers?.cookie ?? '';

export const getIntegrationConfig = (
  context: NuxtContext,
  configuration: object
): IntegrationConfig => {
  const cookie = getHTTPRequestCookies(context);
  return merge(
    {
      axios: {
        baseURL: getBaseUrl(context?.req, context?.base),
        withCredentials: true,
        headers: {
          ...(cookie ? { cookie } : {}),
          ...(context.req ? { Host: context.req.headers['x-forwarded-host'] || context.req.headers.host } : {})
        }
      }
    },
    configuration
  );
};

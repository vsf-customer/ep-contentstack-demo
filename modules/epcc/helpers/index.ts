import { Context as NuxtContext, NuxtAppOptions, Plugin as NuxtPlugin } from '@nuxt/types';
import axios from 'axios';
import { createAddIntegrationToCtx, createExtendIntegrationInCtx } from './context';
import { createProxiedApi, getIntegrationConfig } from './_proxyUtils';
import { configDefault } from '@/modules/epcc/config/default';
import { ModuleOptions } from '@/types/core';
import { Inject } from '@nuxt/types/app';

export interface MapConfigToSetupObjectArgs {
  app: NuxtAppOptions;
  moduleOptions: ModuleOptions;
  additionalProperties?: object;
}

export const integrationPlugin =
  (pluginFn: NuxtPlugin) =>
    (nuxtCtx: NuxtContext, inject: Inject): void => {
      const configure = (tag, configuration) => {
        const injectInContext = createAddIntegrationToCtx({
          tag,
          nuxtCtx,
          inject
        });
        const config = getIntegrationConfig(nuxtCtx, configuration);
        const { middlewareUrl, ssrMiddlewareUrl } = nuxtCtx.$config;

        if (middlewareUrl) {
          config.axios.baseURL = process.server
            ? ssrMiddlewareUrl || middlewareUrl
            : middlewareUrl;
        }

        const client = axios.create(config.axios);
        const api = createProxiedApi({
          givenApi: configuration.api || {},
          client,
          tag
        });

        injectInContext({ api, client, config });
      };

      const extend = (tag, integrationProperties) => {
        createExtendIntegrationInCtx({ tag, nuxtCtx, inject })(
          integrationProperties
        );
      };

      const integration = { configure, extend };

      pluginFn({ ...nuxtCtx, integration } as NuxtContext, inject);
    };

export const getLocaleSettings = (
  app: NuxtAppOptions,
  moduleOptions: ModuleOptions
): object => {
  let localeSettings: Record<string, string> = {};

  if (moduleOptions.cookies) {
    localeSettings = {
      locale: app.$cookies.get(moduleOptions.cookies.localeCookieName),
      country: app.$cookies.get(moduleOptions.cookies.countryCookieName),
      currency: app.$cookies.get(moduleOptions.cookies.currencyCookieName)
    };
  }

  return {
    locale:
      app.i18n.locale ||
      localeSettings.locale ||
      moduleOptions.locale ||
      configDefault.locale ||
      undefined,
    country:
      localeSettings.country ||
      moduleOptions.country ||
      configDefault.country ||
      undefined,
    currency:
      localeSettings.currency ||
      moduleOptions.currency ||
      configDefault.currency ||
      undefined
  };
};

export const mapConfigToSetupObject = ({ app, moduleOptions, additionalProperties = {}}: MapConfigToSetupObjectArgs): object => ({
  ...moduleOptions,
  ...additionalProperties,
  ...getLocaleSettings(app, moduleOptions),
  app
});

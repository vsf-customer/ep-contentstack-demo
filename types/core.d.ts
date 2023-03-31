import { AxiosRequestConfig } from 'axios';
import { NuxtAppOptions } from '@nuxt/types';
import { Context, Inject } from '@nuxt/types/app';
import { NuxtCookies } from 'cookie-universal-nuxt';
import { Catalog } from '@moltin/sdk';
import { ContextualizedEndpoints } from '@vsf-enterprise/epcc-api';
import { NuxtRuntimeConfig } from '@nuxt/types/config/runtime';

/**
 * Type alias for catalog of Elastic Path
 */
export declare type Category = Catalog;

export interface IntegrationConfig {
  axios: AxiosRequestConfig;
}

export interface ContextExtensionProps {
  tag: string;
  nuxtCtx: Context;
  inject: Inject;
}

export interface EpccConfigInterface {
  app: {
    $cookies: NuxtCookies;
    i18n: {
      locale: string;
    };
    $config: NuxtRuntimeConfig;
  };
}

export interface VSFInjectionInterface {
  $epcc: {
    api: ContextualizedEndpoints;
    config: EpccConfigInterface;
  };
}

declare module 'http' {
  export interface IncomingHttpHeaders {
    'x-forwarded-host'?: string;
  }
}

declare module '@nuxt/types' {
  interface Context {
    $vsf: VSFInjectionInterface;
    $cookies: NuxtCookies;
  }
}

export interface NuxtPluginOptions {
  app: NuxtAppOptions;
}

export type ModuleOptions = Record<string, any>;

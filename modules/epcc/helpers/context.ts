import { ContextExtensionProps } from '@/types/core';

/**
 * It extends given integration, defined by `tag` in the context.
 */
export const createExtendIntegrationInCtx =
  ({ tag, nuxtCtx, inject }: ContextExtensionProps) =>
    (integrationProperties: object): void => {
      const integrationKey = '$' + tag;

      if (!nuxtCtx.$vsf || !nuxtCtx.$vsf[integrationKey]) {
        inject('vsf', { [integrationKey]: {} });
      }

      Object.keys(integrationProperties)
        .filter((key) => !['api', 'client', 'config'].includes(key))
        .forEach((key) => {
          nuxtCtx.$vsf[integrationKey][key] = integrationProperties[key];
        });
    };

/**
 * It creates a function that adds an integration to the context under the given name, defined by `tag`.
 */
export const createAddIntegrationToCtx =
  ({ tag, nuxtCtx, inject }: ContextExtensionProps) =>
    (integrationProperties: object): void => {
      const integrationKey = '$' + tag;

      if (nuxtCtx.$vsf && !nuxtCtx.$vsf[integrationKey]) {
        nuxtCtx.$vsf[integrationKey] = integrationProperties;
        return;
      }

      inject('vsf', { [integrationKey]: integrationProperties });
    };

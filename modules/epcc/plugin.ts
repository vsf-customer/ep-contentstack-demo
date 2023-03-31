import { NuxtAppOptions, Context as NuxtContext } from '@nuxt/types';
import {
  integrationPlugin,
  mapConfigToSetupObject
} from '@/modules/epcc/helpers';

const moduleOptions = JSON.parse('<%= JSON.stringify(options) %>');

export default integrationPlugin((context: NuxtContext) => {
  const settings = mapConfigToSetupObject({
    moduleOptions,
    app: context.app
  });

  (context as NuxtAppOptions).integration.configure('epcc', settings);
});

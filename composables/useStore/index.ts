import type {
  UseStoreErrors,
  UseStoreFactoryLoadParamArguments,
  UseStoreFactoryChangeParamArguments
} from '@vue-storefront/core';
import type { UseStore } from './types';
import type { TODO } from '@vsf-enterprise/epcc-api';
import { computed, Ref, ref } from '@nuxtjs/composition-api';

/**
 * @public
 *
 * The `useStore` composable allows loading stores from Elastic Path API.
 * Provides the load and change functions and refs for the response, loading, and error.
 */
export function useStore(): UseStore {
  const response: Ref<TODO> = ref(null);
  const loading: Ref<boolean> = ref(false);
  const error: Ref<UseStoreErrors> = ref({ load: null, change: null });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const load = (params: UseStoreFactoryLoadParamArguments) => {
    try {
      loading.value = true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { customQuery } = Object(params);
      // TODO: implement request to the API
      response.value = {};
      error.value.load = null;
    } catch (err) {
      error.value.load = err;
    } finally {
      loading.value = false;
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const change = (params: UseStoreFactoryChangeParamArguments) => {
    try {
      loading.value = true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { customQuery, currentStore, store } = Object(params);
      // TODO: implement request to the API
      response.value = {};
      error.value.change = null;
    } catch (err) {
      error.value.change = err;
    } finally {
      loading.value = false;
    }
  };

  return {
    load,
    change,
    error: computed(() => error.value),
    loading: computed(() => loading.value),
    response: computed(() => response.value)
  };
}

export * from './types';

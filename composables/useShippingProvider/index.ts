import type {
  UseShippingProvider,
  UseShippingProviderLoad,
  UseShippingProviderErrors
} from './types';
import type { ShippingMethod } from '@vsf-enterprise/epcc-api';
import { readonly, Ref, ref, useContext } from '@nuxtjs/composition-api';

/**
 * @public
 *
 * The `useShippingProvider` composable allows to interact with Shipping Provider
 * custom flow on the Elastic Path API.
 * Provides the load function and refs for the state, loading, and error.
 */
export function useShippingProvider(): UseShippingProvider {
  const { $vsf, $config } = useContext();

  const state = ref<ShippingMethod[]>([]);
  const loading = ref(false);

  const error: Ref<UseShippingProviderErrors> = ref({
    load: null
  });

  const load: UseShippingProviderLoad = async () => {
    try {
      loading.value = true;

      const defaultState = $config.theme?.fallbackShippingMethods ?? [];
      const availableShippingMethods = await $vsf.$epcc.api.getAllEntries(
        'shipping_provider'
      );

      state.value =
        availableShippingMethods.length > 0
          ? availableShippingMethods
          : defaultState;

      error.value.load = null;
    } catch (err) {
      state.value = null;
      error.value.load = err;
    } finally {
      loading.value = false;
    }
  };

  return {
    load,
    error: readonly(error),
    state: readonly(state),
    loading: readonly(loading)
  };
}

export * from './types';

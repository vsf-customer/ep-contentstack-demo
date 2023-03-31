import type { TODO } from '@vsf-enterprise/epcc-api';
import { computed, ref, Ref } from '@nuxtjs/composition-api';
import type { UseShipping, UseShippingErrors } from './types';

/**
 * @public
 *
 * The `useShipping` composable allows loading and save shipping from Elastic Path API.
 * Provides the load and save functions and refs for the shipping, loading, and error.
 */
export function useShipping(): UseShipping {
  const shipping: Ref<TODO> = ref(null);
  const loading: Ref<boolean> = ref(false);
  const error: Ref<UseShippingErrors> = ref({
    load: null,
    save: null
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const load = async (params) => {
    try {
      loading.value = true;
      // TODO: call EPCC api
      const shippingInfo = {};
      error.value.load = null;
      shipping.value = shippingInfo;
    } catch (err) {
      error.value.load = err;
    } finally {
      loading.value = false;
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const save = async (params) => {
    try {
      loading.value = true;
      // TODO: call EPCC api
      const shippingInfo = {};
      error.value.save = null;
      shipping.value = shippingInfo;
    } catch (err) {
      error.value.save = err;
    } finally {
      loading.value = false;
    }
  };

  return {
    load,
    save,
    error: computed(() => error.value),
    loading: computed(() => loading.value),
    shipping: computed(() => shipping.value)
  };
}

export * from './types';

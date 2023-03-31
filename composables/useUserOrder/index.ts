import {
  isApiError,
  forceLoginOnUnauthorizedResponse
} from '@/helpers/general';
import { storeToRefs } from 'pinia';
import { useUserOrderStore } from '@/store/userOrder';
import type { UseUserOrder, UseUserSearch } from './types';
import { computed, useContext } from '@nuxtjs/composition-api';

/**
 * @public
 *
 * The `useUserOrder` composable allows searching for an order in Elastic Path API.
 * It is commonly used in OrderHistory SFC.
 * Provides the search function and refs for the orders, loading, and error.
 */
export function useUserOrder(): UseUserOrder {
  const {
    $vsf: { $epcc }
  } = useContext();
  const { error, orders, loading } = storeToRefs(useUserOrderStore());

  const search: UseUserSearch = async (params) => {
    try {
      loading.value = true;
      orders.value = await $epcc.api.getOrders(params);
      error.value.search = null;
      return orders.value;
    } catch (err) {
      error.value.search = err;
      if (isApiError(err)) {
        await forceLoginOnUnauthorizedResponse(err);
      }
    } finally {
      loading.value = false;
    }
  };

  return {
    error: computed(() => error.value),
    orders: computed(() => orders.value),
    loading: computed(() => loading.value),
    search
  };
}

export * from './types';

import { useCart } from '@/composables';
import { useOrderStore } from '@/store/order';
import type { UseMakeOrder, UseMakeOrderMake } from './types';
import { computed, useContext } from '@nuxtjs/composition-api';

/**
 * @public
 *
 * The `useMakeOrder` composable allows creating an order on Elastic Path API.
 * It is commonly used in Checkout and ThankYou components.
 * Provides the make function and refs for the order, loading, and error.
 */
export function useMakeOrder(): UseMakeOrder {
  const {
    $vsf: { $epcc }
  } = useContext();
  const { cart } = useCart();
  const store = useOrderStore();

  const make: UseMakeOrderMake = async () => {
    try {
      store.loading = true;
      const response = await $epcc.api.checkout({
        items: cart.value.items
      });
      store.error.make = null;
      store.order = response;
    } catch (err) {
      store.error.make = err;
    } finally {
      store.loading = false;
    }
  };

  return {
    make,
    order: computed(() => store.order),
    error: computed(() => store.error),
    loading: computed(() => store.loading)
  };
}

export * from './types';

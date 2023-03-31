import {
  ref,
  Ref,
  ssrRef,
  computed,
  useContext
} from '@nuxtjs/composition-api';
import type { Product } from '@vsf-enterprise/epcc-api';
import type { UseProduct, UseProductSearch, UseProductClear } from './types';
import type { UseProductErrors } from '@vue-storefront/core';

/**
 * @public
 *
 * The `useProduct` composable allows search a product on Elastic Path API.
 * It is commonly used in every Product.vue Single File Component.
 * Provides the search function and refs for the product, loading, and error.
 */
export function useProduct(id: string): UseProduct {
  const {
    $vsf: { $epcc }
  } = useContext();

  const loading = ref(false);
  const product: Ref<Product> = ssrRef(null, id);
  const error: Ref<UseProductErrors> = ref({ search: null });

  const clear: UseProductClear = () => {
    loading.value = false;
    error.value.search = null;
    product.value = null;
  };

  const search: UseProductSearch = async (params) => {
    try {
      loading.value = true;
      const result = await $epcc.api.getProduct(params);
      error.value.search = null;
      return (product.value = result);
    } catch (err) {
      error.value.search = err;
    } finally {
      loading.value = false;
    }
  };

  return {
    clear,
    search,
    error: computed(() => error.value),
    loading: computed(() => loading.value),
    product: computed(() => product.value)
  };
}

export * from './types';

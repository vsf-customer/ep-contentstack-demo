import { ComputedRef } from '@nuxtjs/composition-api';
import { UseProductErrors } from '@vue-storefront/core';
import { GetProductParams, Product } from '@vsf-enterprise/epcc-api';

export type UseProductClear = () => void;
export type UseProductSearch = (params: GetProductParams) => Promise<Product>;

export interface UseProduct {
  clear: UseProductClear;
  search: UseProductSearch;
  loading: ComputedRef<boolean>;
  product: ComputedRef<Product>;
  error: ComputedRef<UseProductErrors>;
}

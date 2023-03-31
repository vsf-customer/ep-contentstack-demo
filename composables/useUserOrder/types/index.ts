import type { ComputedRef } from '@nuxtjs/composition-api';
import type { GetOrdersParams, OrdersResponse } from '@vsf-enterprise/epcc-api';

export interface UseUserOrderErrors {
  search: Error;
}

export type UseUserSearch = (
  params: GetOrdersParams
) => Promise<OrdersResponse>;

export interface UseUserOrder {
  orders: ComputedRef<OrdersResponse>;
  error: ComputedRef<UseUserOrderErrors>;
  loading: ComputedRef<boolean>;
  search: UseUserSearch;
}

import type { OrdersResponse } from '@vsf-enterprise/epcc-api';
import type { UseUserOrderErrors } from '@/composables/useUserOrder/types';

export interface UseUserOrderStoreState {
  orders: OrdersResponse;
  error: UseUserOrderErrors;
  loading: boolean;
}

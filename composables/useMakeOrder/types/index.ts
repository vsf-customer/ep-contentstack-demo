import type { Order } from '@vsf-enterprise/epcc-api';
import type { ComputedRef } from '@nuxtjs/composition-api';

export type UseMakeOrderErrors = {
  make: Error;
};

export type UseMakeOrderMake = () => Promise<void>;

export interface UseMakeOrder {
  make: UseMakeOrderMake;
  order: ComputedRef<Order>;
  error: ComputedRef<UseMakeOrderErrors>;
  loading: ComputedRef<boolean>;
}

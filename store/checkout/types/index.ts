import { Store } from 'pinia';
import { UseCheckoutData } from '@/composables/useCheckout/types';

export interface UseCheckoutStoreState {
  data: UseCheckoutData;
}

export type UseCheckoutStore = Store<'checkout-store', UseCheckoutStoreState>;

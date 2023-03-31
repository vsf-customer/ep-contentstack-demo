import type {
  UseCheckoutStore,
  UseCheckoutStoreState
} from '@/store/checkout/types';
import { defineStore } from 'pinia';
import { useContext } from '@nuxtjs/composition-api';
import { COOKIE_KEY_CHECKOUT_DATA } from '@/constants';

export const useCheckoutStore = (): UseCheckoutStore => {
  const { $cookies } = useContext();

  return defineStore('checkout-store', {
    state: (): UseCheckoutStoreState => ({
      data: $cookies.get(COOKIE_KEY_CHECKOUT_DATA) || {
        customer: {},
        payment_method: {},
        shipping_method: {},
        billing_address: {},
        shipping_address: {}
      }
    })
  })();
};

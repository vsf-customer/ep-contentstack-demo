import type { UseCartStoreState } from '@/store/cart/types';

import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart-store', {
  state: (): UseCartStoreState => ({
    cart: null,
    loading: false,
    error: {
      load: null,
      clear: null,
      addItem: null,
      removeItem: null,
      applyCoupon: null,
      removeCoupon: null,
      updateItemQty: null
    }
  })
});

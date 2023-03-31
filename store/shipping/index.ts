import { defineStore } from 'pinia';
import type { UseUserShippingStoreState } from '@/store/shipping/types';

export const useUserShippingStore = defineStore('shipping-store', {
  state: (): UseUserShippingStoreState => ({
    shipping: [],
    loading: false,
    error: {
      load: null,
      addAddress: null,
      deleteAddress: null,
      updateAddress: null,
      setDefaultAddress: null
    }
  })
});

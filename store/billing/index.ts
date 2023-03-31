import { defineStore } from 'pinia';
import type { UseUserBillingStoreState } from '@/store/billing/types';

export const useUserBillingStore = defineStore('billing-store', {
  state: (): UseUserBillingStoreState => ({
    billing: [],
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

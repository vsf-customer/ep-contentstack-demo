import type { UseUserOrderStoreState } from '@/store/userOrder/types';

import { defineStore } from 'pinia';

export const useUserOrderStore = defineStore('user-order-store', {
  state: (): UseUserOrderStoreState => ({
    orders: null,
    loading: false,
    error: {
      search: null
    }
  })
});

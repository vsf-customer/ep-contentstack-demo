import type { UseWishlistStoreState } from '@/store/wishlist/types';

import { defineStore } from 'pinia';

export const useWishlistStore = defineStore('wishlist-store', {
  state: (): UseWishlistStoreState => ({
    loading: false,
    wishlist: null,
    error: {
      load: null,
      clear: null,
      addItem: null,
      removeItem: null
    }
  })
});

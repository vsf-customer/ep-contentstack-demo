import type { UseLocaleStoreState } from '@/store/locale/types';

import { defineStore } from 'pinia';

export const useLocaleStore = defineStore('locale-store', {
  state: (): UseLocaleStoreState => ({
    activeCurrency: null,
    currencies: [],
    loading: false,
    error: {
      load: null
    }
  })
});

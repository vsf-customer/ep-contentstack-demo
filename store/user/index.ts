import type { UseUserStoreState } from '@/store/user/types';

import { defineStore } from 'pinia';

export const useUserStore = defineStore('user-store', {
  state: (): UseUserStoreState => ({
    user: null,
    loading: false,
    error: {
      load: null,
      login: null,
      logout: null,
      register: null,
      updateUser: null,
      changePassword: null
    }
  })
});

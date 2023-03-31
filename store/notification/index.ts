import type { UseNotificationStoreState } from '@/store/notification/types';

import { defineStore } from 'pinia';

export const useNotificationStore = defineStore('notification-store', {
  state: (): UseNotificationStoreState => ({
    notifications: []
  })
});

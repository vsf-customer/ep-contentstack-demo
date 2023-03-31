import { useNotificationStore } from '@/store/notification';
import { UiNotification } from '@/store/notification/types';
import { computed } from '@nuxtjs/composition-api';

const maxVisibleNotifications = 3;
const timeToLive = 3000;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useUiNotification = () => {
  const store = useNotificationStore();

  const send = (notification: Omit<UiNotification, 'id' | 'dismiss'>) => {
    const id = Symbol();

    const dismiss = () => {
      const index = store.notifications.findIndex(
        (notification) => notification.id === id
      );

      if (index !== -1) store.notifications.splice(index, 1);
    };

    const newNotification = {
      ...notification,
      id,
      dismiss
    };

    store.notifications.push(newNotification);
    if (store.notifications.length > maxVisibleNotifications)
      store.notifications.shift();

    if (!notification.persist) {
      setTimeout(dismiss, timeToLive);
    }
  };

  return {
    send,
    notifications: computed(() => store.notifications)
  };
};

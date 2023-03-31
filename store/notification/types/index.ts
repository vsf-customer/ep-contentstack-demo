export interface UiNotification {
  message: string;
  action?: { text: string; onClick: (...args: any) => void };
  type: 'danger' | 'success' | 'info';
  icon?: string;
  persist?: boolean;
  id: symbol;
  dismiss: () => void;
}

export interface UseNotificationStoreState {
  notifications: UiNotification[];
}

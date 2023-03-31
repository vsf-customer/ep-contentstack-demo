import type { Cart } from '@vsf-enterprise/epcc-api';

export interface UseCartStoreErrors {
  load: Error
  clear: Error
  addItem: Error
  removeItem: Error
  applyCoupon: Error
  removeCoupon: Error
  updateItemQty: Error
}

export interface UseCartStoreState {
  cart: Cart;
  loading: boolean;
  error: UseCartStoreErrors;
}

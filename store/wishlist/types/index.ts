import type { Cart } from '@vsf-enterprise/epcc-api';
import type { UseWishlistErrors } from '@/composables/useWishlist';

export interface UseWishlistStoreState {
  error: UseWishlistErrors;
  loading: boolean;
  wishlist: Cart;
}

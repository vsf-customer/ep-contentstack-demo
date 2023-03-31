import type {
  Cart,
  Product,
  CartItem,
  Wishlist
} from '@vsf-enterprise/epcc-api';
import type { Ref, DeepReadonly } from '@nuxtjs/composition-api';

export interface UseWishlistErrors {
  load: Error;
  clear: Error;
  addItem: Error;
  removeItem: Error;
}

export type UseWishlistAddItemParams = {
  product: Product;
};

export type UseWishlistRemoveItemParams = {
  wishlistItem: CartItem;
};

export type UseWishlistIsInWishlistParams = {
  product: Product;
};

export type UseWishlistSet = (value: Wishlist) => void;
export type UseWishlistLoad = () => Promise<void>;
export type UseWishlistClear = () => Promise<Wishlist>;
export type UseWishlistAddItem = (
  params: UseWishlistAddItemParams
) => Promise<Wishlist>;
export type UseWishlistRemoveItem = (
  params: UseWishlistRemoveItemParams
) => Promise<Wishlist>;
export type UseWishlistIsInWishlist = (
  params: UseWishlistIsInWishlistParams
) => boolean;

export interface UseWishlist {
  error: DeepReadonly<Ref<UseWishlistErrors>>;
  loading: DeepReadonly<Ref<boolean>>;
  wishlist: DeepReadonly<Ref<Cart>>;
  set: UseWishlistSet;
  load: UseWishlistLoad;
  clear: UseWishlistClear;
  addItem: UseWishlistAddItem;
  removeItem: UseWishlistRemoveItem;
  isInWishlist: UseWishlistIsInWishlist;
}

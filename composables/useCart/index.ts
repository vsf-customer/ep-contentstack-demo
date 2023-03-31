import type {
  UseCart,
  UseCartAddItemParams,
  UseCartIsInCartParams,
  UseCartUpdateQtyParams,
  UseCartRemoveItemParams,
  UseCartApplyCouponParams,
  UseCartRemoveCouponParams
} from '@/composables/useCart/types';
import type { Cart, CartItem } from '@vsf-enterprise/epcc-api';

import { useCartStore } from '@/store/cart';
import { COOKIE_KEY_CART_ID } from '@/constants';
import { computed, useContext } from '@nuxtjs/composition-api';
import { useLocale } from '@/composables';

/**
 * @public
 *
 * The `useCart` composable allows loading/creating a cart from Elastic Path API.
 * It is commonly used in every page/component related to the shop experience.
 * Provides the load, clear, addItem, setCart, isInCart, removeItem, applyCoupon,
 * removeCoupon, updateItemQty functions and refs for the cart, loading, and error.
 */
export function useCart(): UseCart {
  const store = useCartStore();
  const { i18n, $vsf, $cookies } = useContext();
  const { activeCurrency } = useLocale();

  const load = async (): Promise<Cart> => {
    if (store.cart) {
      return store.cart;
    }

    try {
      store.loading = true;
      const id: string = $cookies.get(COOKIE_KEY_CART_ID);

      if (id) {
        store.cart = await $vsf.$epcc.api.getCart({ id, locale: i18n.locale });
      } else {
        store.cart = await $vsf.$epcc.api
          .createCart({ name: 'cart', locale: i18n.locale })
          .then((cart: Cart) => {
            $cookies.set(COOKIE_KEY_CART_ID, cart.id, { path: '/' });
            return cart;
          });
      }

      return store.cart;
    } catch (err) {
      store.error.load = err;
    } finally {
      store.loading = false;
    }
  };

  const clear = async (): Promise<Cart> => {
    try {
      store.loading = true;
      const items = await $vsf.$epcc.api.removeCartItems({
        locale: i18n.locale,
        cartId: store.cart.id
      });
      store.error.clear = null;
      const cart = await $vsf.$epcc.api.getCart({ id: store.cart.id });

      store.cart = {
        ...cart,
        items
      };
      return store.cart;
    } catch (err) {
      store.error.clear = err;
    } finally {
      store.loading = false;
    }
  };

  const setCart = (newCart: Cart): void => {
    store.cart = newCart;
  };

  const addItem = async (params: UseCartAddItemParams): Promise<Cart> => {
    try {
      store.loading = true;

      const items: CartItem[] = await $vsf.$epcc.api.addProductToCart({
        locale: i18n.locale,
        cartId: store.cart.id,
        quantity: params.quantity,
        productId: params.product.id,
        currency: activeCurrency.value?.code
      });
      const cart = await $vsf.$epcc.api.getCart({ id: store.cart.id });
      store.cart = {
        ...cart,
        items
      };
      store.error.addItem = null;
      return store.cart;
    } catch (err) {
      store.error.addItem = err;
    } finally {
      store.loading = false;
    }
  };

  const isInCart = (params: UseCartIsInCartParams) =>
    store.cart?.items?.some(
      (item: CartItem) => item.product_id === params.product.id
    );

  const removeItem = async (params: UseCartRemoveItemParams): Promise<Cart> => {
    try {
      store.loading = true;
      const items: CartItem[] = await $vsf.$epcc.api.removeCartItems({
        locale: i18n.locale,
        cartId: store.cart.id,
        cartItemId: params.product.id
      });
      const cart = await $vsf.$epcc.api.getCart({ id: store.cart.id });

      store.cart = {
        ...cart,
        items
      };
      store.error.removeItem = null;
      return store.cart;
    } catch (err) {
      store.error.removeItem = err;
    } finally {
      store.loading = false;
    }
  };

  const applyCoupon = async (params: UseCartApplyCouponParams) => {
    try {
      store.loading = true;
      const items: CartItem[] = await $vsf.$epcc.api.addPromotionToCart({
        locale: i18n.locale,
        cartId: store.cart.id,
        code: params.couponCode,
        currency: activeCurrency.value?.code
      });
      const cart = await $vsf.$epcc.api.getCart({ id: store.cart.id });

      store.cart = {
        ...cart,
        items
      };
      store.error.applyCoupon = null;
      return store.cart;
    } catch (err) {
      store.error.applyCoupon = err;
    } finally {
      store.loading = false;
    }
  };

  const removeCoupon = async (
    params: UseCartRemoveCouponParams
  ): Promise<Cart> => {
    try {
      store.loading = true;
      const product = store.cart.items.find(
        (item) => item.sku === params.couponCode
      );
      store.cart = await removeItem({ product });
      if (store.error.removeItem) {
        throw store.error.removeItem;
      }

      return store.cart;
    } catch (err) {
      store.error.removeCoupon = err;
    } finally {
      store.loading = false;
    }
  };

  const updateItemQty = async (
    params: UseCartUpdateQtyParams
  ): Promise<Cart> => {
    if (params.quantity <= 0) return;
    try {
      store.loading = true;
      const items: CartItem[] = await $vsf.$epcc.api.updateCartItem({
        locale: i18n.locale,
        cartId: store.cart.id,
        quantity: params.quantity,
        cartItemId: params.product.id,
        currency: activeCurrency.value?.code
      });
      const cart = await $vsf.$epcc.api.getCart({ id: store.cart.id });

      store.cart = {
        ...cart,
        items
      };
      store.error.updateItemQty = null;
      return store.cart;
    } catch (err) {
      store.error.updateItemQty = err;
    } finally {
      store.loading = false;
    }
  };

  return {
    cart: computed(() => store.cart),
    error: computed(() => store.error),
    loading: computed(() => store.loading),
    load,
    clear,
    addItem,
    setCart,
    isInCart,
    removeItem,
    applyCoupon,
    removeCoupon,
    updateItemQty
  };
}

export * from './types';

import type {
  UseWishlist,
  UseWishlistSet,
  UseWishlistLoad,
  UseWishlistClear,
  UseWishlistAddItem,
  UseWishlistRemoveItem,
  UseWishlistIsInWishlist
} from './types';
import { storeToRefs } from 'pinia';
import { useLocale } from '@/composables';
import { useWishlistStore } from '@/store/wishlist';
import type { CartItem } from '@vsf-enterprise/epcc-api';
import { readonly, useContext } from '@nuxtjs/composition-api';
import { COOKIE_KEY_WISHLIST_ID, COOKIE_MAX_AGE } from '@/constants';

/**
 * @public
 *
 * The `useWishlist` composable allows loading/creating a wishlist
 * (which, underneath, is a cart) from Elastic Path API.
 * It is commonly used in every page/component related to the shop experience.
 * Provides the load, clear, addItem, isInWishlist, removeItem functions
 * and refs for the wishlist, loading, and error.
 */
export function useWishlist(): UseWishlist {
  const {
    $cookies,
    $vsf: { $epcc },
    i18n: { locale },
    $config: {
      theme: { wishlistPrefix }
    }
  } = useContext();
  const { activeCurrency } = useLocale();
  const { wishlist, error, loading } = storeToRefs(useWishlistStore());

  const set: UseWishlistSet = (value) => {
    wishlist.value.items = value;
  };

  const load: UseWishlistLoad = async () => {
    const wishlistId = $cookies.get<string>(COOKIE_KEY_WISHLIST_ID);

    try {
      loading.value = true;
      error.value.load = null;

      wishlist.value = wishlistId
        ? await $epcc.api.getCart({
          locale,
          id: wishlistId,
          wishlist: true
        })
        : await $epcc.api
          .createCart({
            locale,
            name: 'wishlist'
          })
          .then((cart) => {
            $cookies.set(COOKIE_KEY_WISHLIST_ID, cart.id, {
              path: '/',
              maxAge: COOKIE_MAX_AGE
            });
            return cart;
          });
    } catch (err) {
      error.value.load = new Error(
        `An error occurred while ${
          wishlistId ? 'loading' : 'creating'
        } the wishlist: ${err.message}`
      );
    } finally {
      loading.value = false;
    }
  };

  const clear: UseWishlistClear = async () => {
    try {
      loading.value = true;
      error.value.clear = null;

      return (wishlist.value.items = await $epcc.api.removeCartItems({
        locale,
        cartId: wishlist.value.id
      }));
    } catch (err) {
      error.value.clear = new Error(
        `An error occurred while clearing the wishlist: ${err.message}`
      );
    } finally {
      loading.value = false;
    }
  };

  const addItem: UseWishlistAddItem = async ({ product }) => {
    try {
      loading.value = true;
      error.value.addItem = null;

      const productPrice =
        product.attributes.price[activeCurrency.value?.code]?.amount ||
        (product.attributes as Omit<CartItem, 'meta'>).unit_price?.amount;
      const mainImage = product.main_image ?? product.files[0];

      return (wishlist.value.items = await $epcc.api.addCustomItemToCart({
        locale,
        cartId: wishlist.value.id,
        currency: activeCurrency.value?.code,
        data: {
          ...product.attributes,
          quantity: 1,
          productId: product.id,
          sku: `${wishlistPrefix}${product.id}`,
          price: {
            amount: productPrice
          },
          image_data: JSON.stringify({
            mime_type: mainImage?.mime_type,
            href: mainImage?.link?.href,
            file_name: mainImage?.file_name
          })
        }
      }));
    } catch (err) {
      error.value.addItem = err;
    } finally {
      loading.value = false;
    }
  };

  const removeItem: UseWishlistRemoveItem = async ({ wishlistItem }) => {
    try {
      loading.value = true;

      return (wishlist.value.items = await $epcc.api.removeCartItems({
        locale,
        cartId: wishlist.value.id,
        cartItemId: wishlistItem.id,
        wishlist: true
      }));
    } catch (err) {
      error.value.removeItem = new Error(
        `An error occurred while removing a product from the wishlist: ${err.message}`
      );
    } finally {
      loading.value = false;
    }
  };

  const isInWishlist: UseWishlistIsInWishlist = ({ product }) =>
    wishlist.value?.items?.some(
      (item: CartItem) => item.sku === `${wishlistPrefix}${product.id}`
    );

  return {
    error: readonly(error),
    loading: readonly(loading),
    wishlist: readonly(wishlist),
    set,
    load,
    clear,
    addItem,
    removeItem,
    isInWishlist
  };
}

export * from './types';

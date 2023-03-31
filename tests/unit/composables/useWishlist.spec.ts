import type {
  Product,
  ContextualizedEndpoints
} from '@vsf-enterprise/epcc-api';
import type { Context } from '@nuxt/types/app';
import type { NuxtI18nInstance } from 'nuxt-i18n';
import type { NuxtCookies } from 'cookie-universal-nuxt';
import type { NuxtRuntimeConfig } from '@nuxt/types/config/runtime';

import {
  generateCartItem,
  generateCartMock
} from '@/tests/__mocks__/cart.mock';
import { expect } from '@jest/globals';
import { setActivePinia } from 'pinia';
import { useWishlist } from '@/composables';
import { createTestingPinia } from '@pinia/testing';
import { productMock } from '@/tests/__mocks__/product.mock';
import { COOKIE_KEY_WISHLIST_ID, COOKIE_MAX_AGE } from '@/constants';

const ctx = {
  $vsf: {
    $epcc: {
      api: {} as Partial<ContextualizedEndpoints>
    }
  },
  i18n: {} as NuxtI18nInstance,
  $cookies: {} as Partial<NuxtCookies>,
  $config: {
    theme: {
      wishlistPrefix: 'wishlist_'
    }
  } as Partial<NuxtRuntimeConfig>
} as Partial<Context>;

jest.mock('@nuxtjs/composition-api', () => ({
  ...jest.requireActual('@nuxtjs/composition-api'),
  useContext: () => ctx
}));

describe('[epcc-theme] useWishlist', () => {
  const locale = 'en-US';
  const wishlistId = 'wishlist-cart-id';

  beforeEach(() => {
    jest.resetAllMocks();
    ctx.i18n.locale = locale;
  });

  describe('set', () => {
    it('should set a wishlist', () => {
      // arrange
      const cartMock = generateCartMock({ empty: true, wishlist: true });

      setActivePinia(
        createTestingPinia({
          initialState: {
            'wishlist-store': {
              wishlist: cartMock
            }
          }
        })
      );
      const { set, wishlist, loading } = useWishlist();

      // act
      set(
        generateCartItem({
          items: [
            { id: 'item-1', quantity: 1 },
            { id: 'item-2', quantity: 2 }
          ],
          wishlist: true
        })
      );

      // assert
      expect(loading.value).toBeFalsy();
      expect(wishlist.value.items.length).toEqual(2);
    });
  });

  describe('load', () => {
    it('should get wishlist using ID', async () => {
      // arrange
      setActivePinia(createTestingPinia());

      const cartMock = generateCartMock({ id: wishlistId });

      ctx.$cookies.get = jest.fn().mockReturnValue(wishlistId);
      ctx.$vsf.$epcc.api.getCart = jest.fn().mockResolvedValue(cartMock);

      const { load, error, wishlist, loading } = useWishlist();

      // act
      await load();

      // assert
      expect(loading.value).toBeFalsy();
      expect(error.value.load).toBeNull();
      expect(wishlist.value).toEqual(cartMock);
      expect(ctx.$vsf.$epcc.api.getCart).toHaveBeenCalledWith({
        locale,
        id: wishlistId,
        wishlist: true
      });
    });

    it('should create a wishlist when there is no ID', async () => {
      setActivePinia(createTestingPinia());

      const cartMock = generateCartMock();

      ctx.$cookies.set = jest.fn();
      ctx.$cookies.get = jest.fn().mockReturnValue(undefined);
      ctx.$vsf.$epcc.api.createCart = jest.fn().mockResolvedValue(cartMock);

      const { load, error, wishlist, loading } = useWishlist();

      // act
      await load();

      // assert
      expect(loading.value).toBeFalsy();
      expect(error.value.load).toBeNull();
      expect(wishlist.value).toEqual(cartMock);
      expect(ctx.$cookies.set).toHaveBeenCalledWith(
        COOKIE_KEY_WISHLIST_ID,
        cartMock.id,
        {
          path: '/',
          maxAge: COOKIE_MAX_AGE
        }
      );
      expect(ctx.$vsf.$epcc.api.createCart).toHaveBeenCalledWith({
        locale,
        name: 'wishlist'
      });
    });

    it('should handle gracefully when getting wishlist and the API throws', async () => {
      // arrange
      setActivePinia(createTestingPinia());

      const err = new Error('request timed out');
      ctx.$cookies.get = jest.fn().mockReturnValue(wishlistId);
      ctx.$vsf.$epcc.api.getCart = jest.fn().mockRejectedValue(err);

      const { load, error, loading, wishlist } = useWishlist();

      // act
      await load();

      // assert
      expect(loading.value).toBeFalsy();
      expect(wishlist.value).toEqual(null);
      expect(error.value.load.message).toEqual(
        `An error occurred while loading the wishlist: ${err.message}`
      );
    });

    it('should handle gracefully when creating wishlist and the API throws', async () => {
      // arrange
      setActivePinia(createTestingPinia());

      const err = new Error('request timed out');
      ctx.$cookies.get = jest.fn().mockReturnValue(undefined);
      ctx.$vsf.$epcc.api.createCart = jest.fn().mockRejectedValue(err);

      const { load, error, loading, wishlist } = useWishlist();

      // act
      await load();

      // assert
      expect(loading.value).toBeFalsy();
      expect(wishlist.value).toEqual(null);
      expect(error.value.load.message).toEqual(
        `An error occurred while creating the wishlist: ${err.message}`
      );
    });
  });

  describe('clear', () => {
    beforeEach(() => {
      setActivePinia(
        createTestingPinia({
          initialState: {
            'wishlist-store': {
              wishlist: generateCartMock({
                id: wishlistId,
                items: [
                  { id: 'item-1', quantity: 1 },
                  { id: 'item-2', quantity: 2 },
                  { id: 'item-3', quantity: 3 }
                ]
              })
            }
          }
        })
      );
    });

    it('should remove all items from wishlist', async () => {
      // arrange
      const { loading, wishlist, error, clear } = useWishlist();
      ctx.$vsf.$epcc.api.removeCartItems = jest.fn().mockResolvedValue([]);

      // act
      await clear();

      // assert
      expect(loading.value).toBeFalsy();
      expect(error.value.clear).toBeNull();
      expect(wishlist.value.items.length).toEqual(0);
      expect(ctx.$vsf.$epcc.api.removeCartItems).toHaveBeenCalledWith({
        locale,
        cartId: wishlistId
      });
    });

    it('should handle gracefully when clearing wishlist and the API throws', async () => {
      // arrange
      const err = new Error('request timed out');
      ctx.$cookies.get = jest.fn().mockReturnValue(undefined);
      ctx.$vsf.$epcc.api.removeCartItems = jest.fn().mockRejectedValue(err);

      const { clear, error, loading, wishlist } = useWishlist();

      // act
      await clear();

      // assert
      expect(loading.value).toBeFalsy();
      expect(wishlist.value.items.length).not.toEqual(0);
      expect(error.value.clear.message).toEqual(
        `An error occurred while clearing the wishlist: ${err.message}`
      );
    });
  });

  describe('addItem', () => {
    beforeEach(() => {
      setActivePinia(
        createTestingPinia({
          initialState: {
            'wishlist-store': {
              wishlist: generateCartMock({ id: wishlistId, empty: true })
            }
          }
        })
      );
    });

    it('should add an item to the wishlist', async () => {
      // arrange
      const { loading, wishlist, error, addItem } = useWishlist();
      ctx.$vsf.$epcc.api.addCustomItemToCart = jest
        .fn()
        .mockResolvedValue([productMock]);

      // act
      await addItem({ product: productMock });

      // assert
      expect(loading.value).toBeFalsy();
      expect(error.value.addItem).toBeNull();
      expect(wishlist.value.items.length).toEqual(1);
      expect(ctx.$vsf.$epcc.api.addCustomItemToCart).toHaveBeenCalledWith(
        expect.objectContaining({
          locale,
          cartId: wishlistId,
          data: expect.anything()
        })
      );
    });

    it('should handle gracefully when adding an item to the wishlist and the API throws', async () => {
      // arrange
      const err = new Error('request timed out');
      ctx.$vsf.$epcc.api.addCustomItemToCart = jest.fn().mockRejectedValue(err);

      const { addItem, error, loading, wishlist } = useWishlist();

      // act
      await addItem({ product: productMock });

      // assert
      expect(loading.value).toBeFalsy();
      expect(wishlist.value.items.length).toEqual(0);
      expect(error.value.addItem.message).toEqual(
        err.message
      );
    });
  });

  describe('removeItem', () => {
    beforeEach(() => {
      setActivePinia(
        createTestingPinia({
          initialState: {
            'wishlist-store': {
              wishlist: generateCartMock({
                id: wishlistId,
                items: [{ id: 'item-1' }, productMock]
              })
            }
          }
        })
      );
    });

    it('should remove an item from the wishlist', async () => {
      // arrange
      const { loading, wishlist, error, removeItem } = useWishlist();
      ctx.$vsf.$epcc.api.removeCartItems = jest
        .fn()
        .mockResolvedValue([productMock]);

      // act
      await removeItem({
        wishlistItem: generateCartItem({
          items: [{ id: 'item-1' }]
        })[0]
      });

      // assert
      expect(loading.value).toBeFalsy();
      expect(error.value.removeItem).toBeNull();
      expect(wishlist.value.items.length).toEqual(1);
      expect(ctx.$vsf.$epcc.api.removeCartItems).toHaveBeenCalledWith({
        locale,
        cartId: wishlistId,
        cartItemId: 'item-1',
        wishlist: true
      });
    });

    it('should handle gracefully when removing an item from the wishlist and the API throws', async () => {
      // arrange
      const err = new Error('request timed out');
      ctx.$vsf.$epcc.api.removeCartItems = jest.fn().mockRejectedValue(err);

      const { removeItem, error, loading, wishlist } = useWishlist();

      // act
      await removeItem({
        wishlistItem: generateCartItem({
          items: [{ id: 'item-1' }]
        })[0]
      });

      // assert
      expect(loading.value).toBeFalsy();
      expect(wishlist.value.items.length).toEqual(2);
      expect(error.value.removeItem.message).toEqual(
        `An error occurred while removing a product from the wishlist: ${err.message}`
      );
    });
  });

  describe('isInWishlist', () => {
    it('should return true if wishlist has products', async () => {
      // arrange
      const enhancedProductMock = {
        ...productMock,
        id: 'item-1',
        sku: 'wishlist_item-1'
      };

      setActivePinia(
        createTestingPinia({
          initialState: {
            'wishlist-store': {
              wishlist: generateCartMock({
                items: [enhancedProductMock]
              })
            }
          }
        })
      );
      const { isInWishlist } = useWishlist();

      // act
      const result = isInWishlist({ product: { id: 'item-1' } as Product });

      // assert
      expect(result).toBeTruthy();
    });

    it('should return false if wishlist has products', async () => {
      // arrange
      setActivePinia(createTestingPinia());
      const { isInWishlist } = useWishlist();

      // act
      const result = isInWishlist({ product: { id: 'item-1' } as Product });

      // assert
      expect(result).toBeFalsy();
    });
  });
});

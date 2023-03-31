import { Product } from '@vsf-enterprise/epcc-api';
import { expect } from '@jest/globals';
import { generateCartMock, generateCartItem } from '../../__mocks__/cart.mock';
import { useWishlistData } from '../../../composables/useWishlistData';
import { NuxtRuntimeConfig } from '@nuxt/types/config/runtime';

const cartItemMock = generateCartItem({
  items: [{ quantity: 5 }]
});
const cartMock = generateCartMock({
  empty: false,
  items: cartItemMock,
  wishlist: true
});

jest.mock('@nuxtjs/composition-api', () => ({
  ...jest.requireActual('@nuxtjs/composition-api'),
  useContext: () => ({
    $config: {
      theme: {
        wishlistPrefix: 'wishlist_'
      }
    } as Partial<NuxtRuntimeConfig>
  })
}));

jest.mock('@/composables/useLocale', () => ({
  useLocale: () => ({
    activeCurrency: { value: 'USD' },
    currencies: {
      value: []
    }
  })
}));

describe('[epcc-theme] useWishlistData', () => {
  const wishlistData = useWishlistData();
  const wishlistMock = cartMock.items;

  describe('getItems', () => {
    it('should return the wishlist', async () => {
      expect(wishlistData.getItems(wishlistMock)).toEqual(wishlistMock);
    });
  });

  describe('getLineItemByProductId', () => {
    it('should find a wishlist item with the specified product id', async () => {
      const productId = wishlistMock[0].id;

      expect(
        wishlistData.getLineItemByProductId(wishlistMock, {
          id: productId
        } as Product)
      ).toEqual(wishlistMock[0]);
    });
  });
});

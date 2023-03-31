import { useCartData } from '../../../composables/useCartData';
import { promotionMock } from '../../__mocks__/promotion.mock';
import { expect } from '@jest/globals';
import { setActivePinia } from 'pinia';
import { createTestingPinia } from '@pinia/testing';
import {
  generateCartItem,
  generateCartMock
} from '@/tests/__mocks__/cart.mock';
import { themeConfigMock } from '@/tests/__mocks__/themeConfig.mock';

jest.mock('@nuxtjs/composition-api', () => ({
  ...jest.requireActual('@nuxtjs/composition-api'),
  useContext: () => ({
    $config: {
      theme: themeConfigMock
    },
    i18n: {
      locale: 'en'
    },
    $vsf: {
      $epcc: {}
    }
  })
}));

setActivePinia(createTestingPinia());

describe('[epcc-theme] useCartData', () => {
  const cartData = useCartData();

  describe('getItems', () => {
    it('should return the union of the physical and digital items', () => {
      // arrange
      const cartMock = generateCartMock({ empty: true });

      // assert
      expect(cartData.getItems(cartMock)).toEqual(cartMock.items);
    });

    it('should return empty array when cart is not defined', () => {
      // assert
      expect(cartData.getItems(undefined)).toEqual([]);
    });
  });

  describe('getItemName', () => {
    it('should return the name of the item', () => {
      // arrange
      const cartItemsMock = generateCartItem({ items: [{}] });

      // assert
      expect(cartData.getItemName(cartItemsMock[0])).toEqual(
        cartItemsMock[0].name
      );
    });

    it('should return empty string when item is not defined', () => {
      // assert
      expect(cartData.getItemName(undefined)).toEqual('');
    });
  });

  describe('getItemImage', () => {
    it('should return the default image of the product', () => {
      // arrange
      const cartItemsMock = generateCartItem({ items: [{}] });

      // assert
      expect(cartData.getItemImage(cartItemsMock[0])).toEqual(
        cartItemsMock[0].image.href
      );
    });

    it('should return empty string when item is not defined', () => {
      // assert
      expect(cartData.getItemImage(undefined)).toEqual('');
    });
  });

  describe('getItemPrice', () => {
    it('should return only the regular price when sale price and list price are equal', () => {
      // arrange
      const cartItemsMock = generateCartItem({ items: [{}] });

      // assert
      expect(cartData.getItemPrice(cartItemsMock[0])).toEqual({
        regular: cartItemsMock[0].value.amount
      });
    });

    it('should return regular and special prices when sale price and list price are not equal', () => {
      // arrange
      const discountAmount = -500;
      const cartItemsMock = generateCartItem({ items: [{ price: 700 }] });
      const itemDiscount = { code: 'SALE', amount: { amount: discountAmount } };
      const modifiedCartItem = {
        ...cartItemsMock[0],
        discounts: [itemDiscount]
      };

      // act
      const result = cartData.getItemPrice(modifiedCartItem);

      // assert
      expect(result).toEqual({
        regular: 700,
        special: 200
      });
    });
  });

  describe('getItemUnitPrice', () => {
    it('should return the unit price of the item', () => {
      // arrange
      const cartItemsMock = generateCartItem({ items: [{}] });

      // assert
      expect(cartData.getItemUnitPrice(cartItemsMock[0])).toEqual({
        regular: cartItemsMock[0].unit_price.amount
      });
    });
  });

  describe('getItemPriceFormatted', () => {
    it('return the formatted price of the item', () => {
      // arrange
      const itemDiscount = { code: 'SALE', amount: { amount: -400 } };
      const cartMock = generateCartMock({
        items: [
          {
            price: 12000
          }
        ]
      });
      const modifiedCartItem = {
        ...cartMock.items[0],
        discounts: [itemDiscount]
      };

      // assert
      expect(cartData.getItemPriceFormatted(modifiedCartItem)).toEqual({
        regular: '$120.00',
        special: '$116.00'
      });
    });
  });

  describe('getItemQty', () => {
    it('should return the quantity of the item', () => {
      // arrange
      const cartItemsMock = generateCartItem({ items: [{}] });

      // assert
      expect(cartData.getItemQty(cartItemsMock[0])).toEqual(
        cartItemsMock[0].quantity
      );
    });
  });

  describe('getBundleComponents', () => {
    it('should return the components of the cart item if it is a bundle', () => {
      // arrange
      const cartMock = generateCartMock({
        items: [{ quantity: 5 }, { quantity: 10 }]
      });
      const item = cartMock.items[1];

      // assert
      expect(cartData.getBundleComponents(item)).toEqual(
        Object.values(item.components).map((component) => ({
          id: component.options[0].id,
          name: component.options[0].attributes.name,
          quantity: component.options[0].quantity
        }))
      );
    });

    it('should return empty array if the cart item is not a bundle', () => {
      // arrange
      const cartItemsMock = generateCartItem({ items: [] });

      // assert
      expect(cartData.getBundleComponents(cartItemsMock[0])).toEqual([]);
    });
  });

  describe('getItemSku', () => {
    it('should return the sku of the item', () => {
      // arrange
      const cartItemsMock = generateCartItem({ items: [{}] });

      // assert
      expect(cartData.getItemSku(cartItemsMock[0])).toEqual(
        cartItemsMock[0].sku
      );
    });
  });

  describe('getTotals', () => {
    it('should return the total price of cart', () => {
      // arrange
      const cartMock = generateCartMock({
        meta: {
          without_tax: {
            amount: 200
          },
          discount: {
            amount: -100
          }
        },
        promo: { value: 100 },
        items: [{ price: 100 }, { price: 200 }]
      });

      // assert
      expect(cartData.getTotals(cartMock)).toEqual({
        total: cartMock.meta.display_price.with_tax.amount,
        subtotal: cartMock.meta.display_price.without_tax.amount
      });
    });

    it('should return object with 0 values when cart is not defined', () => {
      expect(cartData.getTotals(undefined)).toEqual({
        total: 0,
        subtotal: 0
      });
    });
  });

  describe('getTotalItems', () => {
    it('should return the number of items in the cart', () => {
      // arrange
      const cartMock = generateCartMock({
        items: [{ quantity: 1 }, { quantity: 1 }, { quantity: 1 }]
      });

      // assert
      expect(cartData.getTotalItems(cartMock)).toEqual(3);
    });

    it('should return 0 when cart is not defined', () => {
      // assert
      expect(cartData.getTotalItems(undefined)).toEqual(0);
    });
  });

  describe('getTotalsFormatted', () => {
    it('should return the formatted price values', () => {
      // arrange
      const cartMock = generateCartMock({
        items: [{ price: 10000 }, { price: 10000 }],
        meta: {
          without_tax: { formatted: '$200.00', amount: 20000 },
          with_tax: { formatted: '$200.00', amount: 20000 }
        }
      });

      // assert
      expect(cartData.getTotalsFormatted(cartMock)).toEqual({
        total: cartMock.meta.display_price.with_tax.formatted,
        subtotal: cartMock.meta.display_price.without_tax.formatted
      });
    });
  });

  describe('getCoupons', () => {
    it('should return the coupons applied to the cart', () => {
      // arrange
      const cartMock = generateCartMock({
        items: [promotionMock]
      });

      // assert
      expect(cartData.getCoupons(cartMock)).toEqual([
        {
          id: promotionMock.id,
          name: promotionMock.name,
          value: promotionMock.value.amount,
          code: promotionMock.sku
        }
      ]);
    });

    it('should return empty array when the cart has no coupons', () => {
      // arrange
      const cartMock = generateCartMock();

      // assert
      expect(cartData.getCoupons(cartMock)).toEqual([]);
    });
  });

  describe('getDiscounts', () => {
    it('should collect all the discounts applied to the cart', async () => {
      const cartMock = generateCartMock({ items: [{}] });
      const item = cartMock.items[0];
      const itemDiscount = { code: 'HALLOW', amount: { amount: -100 } };

      expect(
        cartData.getDiscounts({
          ...cartMock,
          items: [
            promotionMock,
            {
              ...item,
              discounts: [itemDiscount]
            }
          ]
        })
      ).toEqual([
        {
          id: promotionMock.id,
          name: promotionMock.name,
          value: promotionMock.value.amount,
          description: promotionMock.sku
        },
        {
          id: itemDiscount.code,
          name: itemDiscount.code,
          description: `Item discount for ${item.name} (${item.sku})`,
          value: itemDiscount.amount.amount
        }
      ]);
    });

    it('should return empty array when the cart has no discounts', () => {
      // arrange
      const cartMock = generateCartMock();

      // assert
      expect(cartData.getDiscounts(cartMock)).toEqual([]);
    });
  });

  describe('getTax', () => {
    it('returns the tax value on the cart', async () => {
      const expectedTaxAmount = 100;
      const cartMock = generateCartMock({
        meta: {
          tax: {
            amount: expectedTaxAmount
          }
        }
      });

      expect(cartData.getTax(cartMock)).toEqual(expectedTaxAmount);
    });

    it('returns zero if no tax data presents', () => {
      const cartMock = generateCartMock();

      expect(cartData.getTax(cartMock)).toEqual(0);
    });
  });
});

import { expect } from '@jest/globals';
import { useCart } from '@/composables';
import { COOKIE_KEY_CART_ID } from '@/constants';
import { productMock } from '@/tests/__mocks__/product.mock';
import {
  generateCartMock,
  generateCartItem,
  updateItemQtyMockFn,
  addPromotionToCartMockFn,
  removeCartItemFromCartMockFn,
  removePromotionFromCartMockFn
} from '@/tests/__mocks__/cart.mock';
import { setActivePinia } from 'pinia';
import { createTestingPinia } from '@pinia/testing';

const ctx = {
  $vsf: {
    $epcc: {
      api: {
        getCart: jest.fn(),
        createCart: jest.fn(),
        updateCartItem: jest.fn(),
        removeCartItems: jest.fn(),
        addProductToCart: jest.fn(),
        addPromotionToCart: jest.fn()
      }
    }
  },
  $cookies: {
    get: jest.fn(),
    set: jest.fn()
  },
  i18n: {
    locale: 'en'
  }
};

jest.mock('@nuxtjs/composition-api', () => ({
  ...jest.requireActual('@nuxtjs/composition-api'),
  useContext: () => ctx
}));

describe('[epcc-theme] useCart', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    setActivePinia(createTestingPinia());
  });

  const cartId = '9c1bd74d-xxx-yyy-zzz-1b2d1fa5787d';

  describe('load', () => {
    describe('happy path', () => {
      beforeEach(async () => {
        ctx.$vsf.$epcc.api.getCart.mockResolvedValue(
          generateCartMock({ empty: true })
        );
        ctx.$vsf.$epcc.api.createCart.mockResolvedValue(
          generateCartMock({ empty: true })
        );
      });

      it('should fetch the cart when cookies are set', async () => {
        // arrange
        const { load, cart, error } = useCart();

        ctx.$cookies.get.mockReturnValueOnce(cartId);

        // act
        const loadedCart = await load();

        // assert
        expect(error.value.load).toBeNull();
        expect(cart.value).toStrictEqual(loadedCart);
        expect(ctx.$cookies.get).toHaveBeenCalledTimes(1);
        expect(ctx.$cookies.get).toHaveBeenCalledWith(COOKIE_KEY_CART_ID);
        expect(ctx.$cookies.set).toHaveBeenCalledTimes(0);
        expect(ctx.$vsf.$epcc.api.getCart).toHaveBeenCalledTimes(1);
        expect(ctx.$vsf.$epcc.api.getCart).toHaveBeenCalledWith({
          id: cartId,
          locale: 'en'
        });
      });

      it('should create a cart when cookies are not set', async () => {
        // arrange
        const { load, cart, error } = useCart();

        ctx.$cookies.get.mockReturnValueOnce('');

        // act
        const loadedCart = await load();

        // assert
        expect(error.value.load).toBeNull();
        expect(cart.value).toStrictEqual(loadedCart);
        expect(ctx.$cookies.get).toHaveBeenCalledTimes(1);
        expect(ctx.$cookies.get).toHaveBeenCalledWith(COOKIE_KEY_CART_ID);
        expect(ctx.$cookies.set).toHaveBeenCalledTimes(1);
        expect(ctx.$cookies.set).toHaveBeenCalledWith(
          COOKIE_KEY_CART_ID,
          cart.value.id,
          { path: '/' }
        );
        expect(ctx.$vsf.$epcc.api.createCart).toHaveBeenCalledTimes(1);
        expect(ctx.$vsf.$epcc.api.createCart).toHaveBeenCalledWith({
          name: 'cart',
          locale: 'en'
        });
      });

      it('should return the existing cart when load was already invoked', async () => {
        // arrange
        const { load, error } = useCart();

        ctx.$cookies.get.mockReturnValueOnce(cartId);

        // act
        const loadedCart = await load();

        // assert
        expect(error.value.load).toBeNull();
        expect(await load()).toStrictEqual(loadedCart);
        expect(ctx.$cookies.get).toHaveBeenCalledTimes(1);
        expect(ctx.$cookies.get).toHaveBeenCalledWith(COOKIE_KEY_CART_ID);
        expect(ctx.$cookies.set).toHaveBeenCalledTimes(0);
        expect(ctx.$vsf.$epcc.api.getCart).toHaveBeenCalledTimes(1);
        expect(ctx.$vsf.$epcc.api.getCart).toHaveBeenCalledWith({
          id: cartId,
          locale: 'en'
        });
      });
    });

    describe('unhappy path', () => {
      it('should set the error when getCart throws', async () => {
        // arrange
        const { load, error } = useCart();

        ctx.$cookies.get.mockReturnValueOnce(cartId);
        ctx.$vsf.$epcc.api.getCart.mockRejectedValue(
          new Error('could not get cart')
        );

        // act
        await load();

        // assert
        expect(error.value.load.message).toBe('could not get cart');
      });

      it('should set the error when createCart throws', async () => {
        // arrange
        const { load, error } = useCart();

        ctx.$cookies.get.mockReturnValueOnce('');
        ctx.$vsf.$epcc.api.createCart.mockRejectedValue(
          new Error('could not create cart')
        );

        // act
        await load();

        // assert
        expect(error.value.load.message).toBe('could not create cart');
      });
    });
  });

  describe('clear', () => {
    beforeEach(async () => {
      ctx.$cookies.get.mockReturnValueOnce(cartId);
    });

    describe('happy path', () => {
      it('should clear the cart', async () => {
        // arrange
        const { clear, load, cart, error } = useCart();

        // 1. get a mocked cart
        const cartMock = generateCartMock({
          empty: false,
          // get a cart with 1 cart item with 1 item of the product
          items: [
            { quantity: 10 },
            { quantity: 5 },
            { quantity: 4 },
            { quantity: 7 }
          ]
        });
        // 2. mock the get cart fn
        ctx.$vsf.$epcc.api.getCart.mockResolvedValue(cartMock);
        // 3. mock the remove item response (which needs the cart instance)
        ctx.$vsf.$epcc.api.removeCartItems.mockResolvedValue(
          removeCartItemFromCartMockFn({
            cart: cartMock
          })
        );

        // act
        await load();
        await clear();

        // assert
        expect(error.value.clear).toBeNull();
        expect(cart.value.items.length).toBe(0);
      });
    });

    describe('unhappy path', () => {
      it('should set the error when removeCartItems throws', async () => {
        // arrange
        const { clear, load, cart, error } = useCart();

        // 1. get a mocked cart
        const cartMock = generateCartMock({
          empty: false,
          // get a cart with 1 cart item with 1 item of the product
          items: [
            { quantity: 10 },
            { quantity: 6 },
            { quantity: 3 },
            { quantity: 4 }
          ]
        });
        // 2. mock the get cart fn
        ctx.$vsf.$epcc.api.getCart.mockResolvedValue(cartMock);
        // 3. mock the remove item response to throw
        ctx.$vsf.$epcc.api.removeCartItems.mockRejectedValue(
          new Error('could not remove item')
        );

        // act
        await load();
        await clear();

        // assert
        expect(cart.value.items.length).toBe(4);
        expect(error.value.clear.message).toBe('could not remove item');
      });
    });
  });

  describe('setCart', () => {
    it('should set a new cart', async () => {
      // arrange
      const { load, cart, setCart } = useCart();

      const quantityOfItems = 15;
      ctx.$vsf.$epcc.api.createCart.mockResolvedValue(
        generateCartMock({ empty: true })
      );

      // act
      const loadedCart = await load();
      setCart(
        generateCartMock({
          empty: false,
          items: [{ quantity: quantityOfItems }]
        })
      );

      // assert
      expect(loadedCart.items.length).toBe(0);
      expect(cart.value.items.length).toBe(1);
      expect(cart.value.items[0].quantity).toBe(quantityOfItems);
      expect(cart.value).not.toStrictEqual(loadedCart);
    });
  });

  describe('addItem', () => {
    beforeEach(async () => {
      ctx.$vsf.$epcc.api.getCart.mockResolvedValue(
        generateCartMock({ empty: true })
      );
    });

    describe('happy path', () => {
      it('should add one item to the cart', async () => {
        // arrange
        const { addItem, load, cart, error } = useCart();

        // get a mocked cart item
        ctx.$cookies.get.mockReturnValueOnce(
          '9c1bd74d-3504-455d-aa12-1b2d1fa5787d'
        );
        ctx.$vsf.$epcc.api.addProductToCart.mockResolvedValue(
          generateCartItem({ items: [{ quantity: 1 }] })
        );

        // act
        const loadedCart = await load();
        const updatedCart = await addItem({
          quantity: 1,
          product: productMock
        });

        // assert
        expect(error.value.addItem).toBeNull();
        expect(cart.value).toStrictEqual(updatedCart);
        expect(loadedCart.items.length).toBe(0);
        expect(updatedCart.items.length).toBe(1);
        expect(updatedCart.items[0].quantity).toBe(1);
      });

      it('should add multiple items to the cart', async () => {
        // arrange
        const { addItem, load, cart, error } = useCart();

        const qty = 15;
        // get a mocked cart item
        const cartItemMock = generateCartItem({
          items: [{ quantity: qty }]
        });
        ctx.$vsf.$epcc.api.addProductToCart.mockResolvedValue(cartItemMock);
        ctx.$cookies.get.mockReturnValueOnce(
          '9c1bd74d-3504-455d-aa12-1b2d1fa5787d'
        );

        // act
        const loadedCart = await load();
        const updatedCart = await addItem({
          quantity: qty,
          product: productMock
        });

        // assert
        expect(error.value.addItem).toBeNull();
        expect(cart.value).toStrictEqual(updatedCart);
        expect(loadedCart.items.length).toBe(0);
        expect(updatedCart.items.length).toBe(1);
        expect(updatedCart.items[0].quantity).toBe(qty);
      });
    });

    describe('unhappy path', () => {
      it('should set the error when addProductToCart throws', async () => {
        // arrange
        const { addItem, load, cart, error } = useCart();

        // get a mocked cart item
        ctx.$vsf.$epcc.api.addProductToCart.mockRejectedValue(
          new Error('could not add product to cart')
        );
        ctx.$cookies.get.mockReturnValueOnce(
          '9c1bd74d-3504-455d-aa12-1b2d1fa5787d'
        );

        // act
        await load();
        await addItem({
          quantity: 1,
          product: productMock
        });

        // assert
        expect(cart.value.items.length).toBe(0);
        expect(error.value.addItem.message).toBe(
          'could not add product to cart'
        );
      });
    });
  });

  describe('removeItem', () => {
    beforeEach(async () => {
      ctx.$cookies.get.mockReturnValue(cartId);
    });

    describe('happy path', () => {
      it('should remove one cart item from the cart', async () => {
        // arrange
        const { removeItem, load, cart, error } = useCart();

        // 1. get a mocked cart
        const cartMock = generateCartMock({
          empty: false,
          // get a cart with 1 cart item with 1 item of the product
          items: [{ quantity: 1 }]
        });
        // 2. mock the cart
        ctx.$vsf.$epcc.api.getCart.mockResolvedValue(cartMock);
        // 3. mock the remove item response
        ctx.$vsf.$epcc.api.removeCartItems.mockResolvedValue(
          removeCartItemFromCartMockFn({
            cart: cartMock,
            cartItemId: cartMock.items[0].id
          })
        );

        // act
        await load();
        await removeItem({ product: cart.value.items[0] });

        // assert
        expect(error.value.removeItem).toBeNull();
        expect(cart.value.items.length).toBe(0);
      });

      it('should remove one cart item from the cart when there are multiple cart items on the cart', async () => {
        // arrange
        const { removeItem, load, cart, error } = useCart();

        // 1. get a mocked cart
        const cartMock = generateCartMock({
          empty: false,
          items: [
            { quantity: 3 },
            { quantity: 1 },
            { quantity: 5 },
            { quantity: 10 }
          ]
        });
        // 2. mock the get cart fn
        ctx.$vsf.$epcc.api.getCart.mockResolvedValue(cartMock);
        // 3. mock the remove item response (which needs the cart instance)
        ctx.$vsf.$epcc.api.removeCartItems.mockResolvedValue(
          removeCartItemFromCartMockFn({
            cart: cartMock,
            cartItemId: cartMock.items[2].id
          })
        );

        // act
        await load();
        await removeItem({
          product: cart.value.items[2]
        });

        // assert
        expect(error.value.removeItem).toBeNull();
        expect(cart.value.items.length).toBe(3);
      });
    });

    describe('unhappy path', () => {
      it('should set the error when removeCartItems throws', async () => {
        // arrange
        const { removeItem, load, cart, error } = useCart();

        // 1. get a mocked cart
        const cartMock = generateCartMock({
          empty: false,
          // get a cart with 1 cart item with 1 item of the product
          items: [{ quantity: 1 }]
        });
        // 2. mock the cart
        ctx.$vsf.$epcc.api.getCart.mockResolvedValue(cartMock);
        // 3. mock the remove item response
        ctx.$vsf.$epcc.api.removeCartItems.mockRejectedValue(
          new Error('could not remove item from cart')
        );

        // act
        await load();
        await removeItem({ product: cart.value.items[0] });

        // assert
        expect(cart.value.items.length).toBe(1);
        expect(error.value.removeItem.message).toBe(
          'could not remove item from cart'
        );
      });
    });
  });

  describe('applyCoupon', () => {
    beforeEach(() => {
      ctx.$cookies.get.mockReturnValueOnce(cartId);
    });

    describe('happy path', () => {
      it('should apply a coupon successfully', async () => {
        // arrange
        const { applyCoupon, load, cart, error } = useCart();

        const couponCode = 'TEST-COUPON';
        const cartMock = generateCartMock({
          empty: false,
          items: [{ quantity: 5 }]
        });
        ctx.$vsf.$epcc.api.getCart.mockResolvedValue(cartMock);
        ctx.$vsf.$epcc.api.addPromotionToCart.mockResolvedValue(
          addPromotionToCartMockFn({
            cart: cartMock,
            code: couponCode
          })
        );

        // act
        const loadedCart = await load();
        const updatedCart = await applyCoupon({ couponCode });

        // assert
        expect(error.value.applyCoupon).toBeNull();
        expect(cart.value).toStrictEqual(updatedCart);
        expect(loadedCart.items.length).toBe(1);
        expect(updatedCart.items.length).toBe(2);
        expect(updatedCart.items[0].type).toBe('cart_item');
        expect(updatedCart.items[1].type).toBe('promotion_item');
      });
    });

    describe('unhappy path', () => {
      it('should set the error when addPromotionToCart throws', async () => {
        // arrange
        const { applyCoupon, load, cart, error } = useCart();

        const couponCode = 'TEST-COUPON';
        const cartMock = generateCartMock({
          empty: false,
          items: [{ quantity: 5 }]
        });
        ctx.$vsf.$epcc.api.getCart.mockResolvedValue(cartMock);
        ctx.$vsf.$epcc.api.addPromotionToCart.mockRejectedValue(
          new Error('could not apply coupon')
        );

        // act
        await load();
        await applyCoupon({ couponCode });

        // assert
        expect(cart.value.items.length).toBe(1);
        expect(error.value.applyCoupon.message).toBe('could not apply coupon');
      });
    });
  });

  describe('removeCoupon', () => {
    beforeEach(() => {
      ctx.$cookies.get.mockReturnValueOnce(cartId);
    });

    describe('happy path', () => {
      it('should remove a coupon successfully', async () => {
        // arrange
        const { removeCoupon, load, cart, error } = useCart();

        const couponCode = 'TEST-COUPON';
        const cartMock = generateCartMock({
          items: [{ quantity: 5 }],
          promo: { code: couponCode }
        });
        ctx.$vsf.$epcc.api.getCart.mockResolvedValue(cartMock);
        ctx.$vsf.$epcc.api.removeCartItems.mockResolvedValue(
          removePromotionFromCartMockFn({
            cart: cartMock,
            code: couponCode
          })
        );

        // act
        const loadedCart = await load();
        const updatedCart = await removeCoupon({ couponCode });

        // assert
        expect(error.value.removeCoupon).toBeNull();
        expect(cart.value).toStrictEqual(updatedCart);
        expect(loadedCart.items.length).toBe(2);
        expect(updatedCart.items.length).toBe(1);
        expect(updatedCart.items[0].type).toBe('cart_item');
      });
    });

    describe('unhappy path', () => {
      it('should set the error when removeCoupon throws', async () => {
        // arrange
        const { removeCoupon, load, error } = useCart();

        const couponCode = 'TEST-COUPON';
        const cartMock = generateCartMock({
          empty: false,
          items: [{ quantity: 5 }],
          promo: { code: couponCode }
        });
        ctx.$vsf.$epcc.api.getCart.mockResolvedValue(cartMock);
        ctx.$vsf.$epcc.api.removeCartItems.mockRejectedValue(
          new Error('could not remove coupon')
        );

        // act
        await load();
        await removeCoupon({ couponCode });

        // assert
        expect(error.value.removeCoupon.message).toBe(
          'could not remove coupon'
        );
      });
    });
  });

  describe('updateItemQty', () => {
    beforeEach(async () => {
      ctx.$cookies.get.mockReturnValue(cartId);
    });

    describe('happy path', () => {
      it('should change cart item quantity', async () => {
        // arrange
        const { updateItemQty, load, cart, error } = useCart();

        const expectedQty = 10;
        // 1. get a mocked cart
        const cartMock = generateCartMock({
          empty: false,
          // get a cart with 1 cart item with 1 item of the product
          items: [{ quantity: 1 }]
        });
        // 2. mock the get cart fn
        ctx.$vsf.$epcc.api.getCart.mockResolvedValue(cartMock);
        // 3. mock the update cart item response
        ctx.$vsf.$epcc.api.updateCartItem.mockResolvedValue(
          updateItemQtyMockFn({
            cart: cartMock,
            quantity: expectedQty,
            cartItemId: cartMock.items[0].id
          })
        );

        // act
        await load();
        await updateItemQty({
          quantity: expectedQty,
          product: cartMock.items[0]
        });

        // assert
        expect(error.value.updateItemQty).toBeNull();
        expect(cart.value.items[0].quantity).toBe(expectedQty);
        expect(ctx.$vsf.$epcc.api.updateCartItem).toHaveBeenCalledWith({
          locale: 'en',
          cartId: cartMock.id,
          quantity: expectedQty,
          cartItemId: cartMock.items[0].id
        });
      });
    });

    describe('unhappy path', () => {
      it('should set the error when updateCartItem throws', async () => {
        // arrange
        const { updateItemQty, load, cart, error } = useCart();

        const quantity = 10;
        // 1. get a mocked cart
        const cartMock = generateCartMock({
          empty: false,
          // get a cart with 1 cart item with 1 item of the product
          items: [{ quantity: 1 }]
        });
        // 2. mock the get cart fn
        ctx.$vsf.$epcc.api.getCart.mockResolvedValue(cartMock);
        // 3. mock the update cart item response
        ctx.$vsf.$epcc.api.updateCartItem.mockRejectedValue(
          new Error('could not update cart item')
        );

        // act
        await load();
        await updateItemQty({
          quantity: quantity,
          product: cartMock.items[0]
        });

        // assert
        expect(cart.value.items[0].quantity).toBe(1);
        expect(error.value.updateItemQty.message).toBe(
          'could not update cart item'
        );
      });
    });
  });

  describe('isInCart', () => {
    it('should return true if cart has product', async () => {
      // arrange
      const { load, isInCart } = useCart();

      ctx.$vsf.$epcc.api.createCart.mockResolvedValue(
        generateCartMock({
          empty: false,
          items: [{ quantity: 1, product_id: productMock.id }]
        })
      );

      // act
      await load();
      const result = isInCart({
        product: productMock
      });

      // assert
      expect(result).toBeTruthy();
    });

    it('should return false if cart has product', async () => {
      // arrange
      const { load, isInCart } = useCart();

      ctx.$vsf.$epcc.api.createCart.mockResolvedValue(
        generateCartMock({
          empty: false,
          items: [{ quantity: 1, product_id: 'nonexistent-product-id' }]
        })
      );

      // act
      await load();
      const result = isInCart({
        product: productMock
      });

      // assert
      expect(result).toBeFalsy();
    });
  });
});

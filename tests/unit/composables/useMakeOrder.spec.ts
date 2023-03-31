import { expect } from '@jest/globals';
import { setActivePinia } from 'pinia';
import { useMakeOrder } from '@/composables';
import { Cart } from '@vsf-enterprise/epcc-api';
import { createTestingPinia } from '@pinia/testing';
import { orderMock } from '@/tests/__mocks__/order.mock';
import { generateCartMock } from '@/tests/__mocks__/cart.mock';

const ctx = {
  $vsf: {
    $epcc: {
      api: {
        checkout: jest.fn()
      }
    }
  }
};

jest.mock('@nuxtjs/composition-api', () => ({
  ...jest.requireActual('@nuxtjs/composition-api'),
  useContext: () => ctx
}));

describe('[epcc-theme] useMakeOrder', () => {
  let cartMock: Cart;

  beforeEach(() => {
    cartMock = generateCartMock({
      items: [{ quantity: 5 }]
    });

    jest.resetAllMocks();
    setActivePinia(
      createTestingPinia({
        initialState: {
          'cart-store': {
            cart: cartMock
          }
        }
      })
    );
  });

  describe('make', () => {
    describe('happy path', () => {
      it('should create an order', async () => {
        // arrange
        const { make, order, loading, error } = useMakeOrder();
        ctx.$vsf.$epcc.api.checkout.mockResolvedValueOnce(orderMock);

        // act
        await make();

        // assert
        expect(ctx.$vsf.$epcc.api.checkout).toHaveBeenCalledTimes(1);
        expect(ctx.$vsf.$epcc.api.checkout).toHaveBeenCalledWith({
          items: cartMock.items
        });

        expect(loading.value).toBeFalsy();
        expect(error.value.make).toBeNull();
        expect(order.value).toEqual(orderMock);
      });
    });

    describe('unhappy path', () => {
      it('should handle gracefully when getting a product and the API throws', async () => {
        // arrange
        const { make, order, loading, error } = useMakeOrder();

        ctx.$vsf.$epcc.api.checkout.mockRejectedValue(new Error('API error'));

        // act
        await make();

        // assert
        expect(order.value).toBeNull();
        expect(loading.value).toBeFalsy();
        expect(error.value.make.message).toBe('API error');

        expect(ctx.$vsf.$epcc.api.checkout).toHaveBeenCalledTimes(1);
      });
    });
  });
});

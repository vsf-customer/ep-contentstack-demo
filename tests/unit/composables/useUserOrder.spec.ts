import type {
  OrdersResponse,
  ContextualizedEndpoints
} from '@vsf-enterprise/epcc-api';
import type { Context } from '@nuxt/types';

import { expect } from '@jest/globals';
import faker from '@faker-js/faker';
import { setActivePinia } from 'pinia';
import { useUserOrder } from '@/composables';
import { createTestingPinia } from '@pinia/testing';

const ctx = {
  $vsf: {
    $epcc: {
      api: {} as Partial<ContextualizedEndpoints>
    }
  }
} as Partial<Context>;

jest.mock('@nuxtjs/composition-api', () => ({
  ...jest.requireActual('@nuxtjs/composition-api'),
  useContext: () => ctx
}));

describe('[epcc-theme] useUserOrder', () => {
  describe('search', () => {
    describe('happy path', () => {
      it('should get orders', async () => {
        // arrange
        const params = { data: [{ id: faker.datatype.uuid() }] };
        setActivePinia(createTestingPinia());
        const { error, orders, search, loading } = useUserOrder();
        ctx.$vsf.$epcc.api.getOrders = jest.fn(() =>
          Promise.resolve(params as OrdersResponse)
        );

        // act
        await search({ with: 'items' });

        // assert
        expect(loading.value).toBeFalsy();
        expect(error.value.search).toBeNull();
        expect(orders.value).toEqual(params);
        expect(ctx.$vsf.$epcc.api.getOrders).toHaveBeenCalledWith({
          with: 'items'
        });
      });
    });

    describe('unhappy path', () => {
      it('should handle gracefully when getting all user orders from the API throws', async () => {
        // arrange
        setActivePinia(createTestingPinia());
        const axiosErrorMock = {
          isAxiosError: true,
          response: { status: 401 }
        };
        ctx.redirect = jest.fn();
        ctx.$vsf.$epcc.api.getOrders = jest.fn(() =>
          Promise.reject(axiosErrorMock)
        );
        const { error, orders, search, loading } = useUserOrder();

        // act
        await search({ with: 'items' });

        // assert
        expect(orders.value).toBeNull();
        expect(loading.value).toBeFalsy();
        expect(error.value.search).toEqual(axiosErrorMock);
        expect(ctx.redirect).toHaveBeenCalledWith('/?forceLogin');
        expect(ctx.$vsf.$epcc.api.getOrders).toHaveBeenCalledWith({
          with: 'items'
        });
      });
    });
  });
});

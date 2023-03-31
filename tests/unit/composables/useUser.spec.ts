import { expect } from '@jest/globals';
import { setActivePinia } from 'pinia';
import { useCart } from '@/composables';
import { useUserStore } from '@/store/user';
import { useUser } from '@/composables/useUser';
import { createTestingPinia } from '@pinia/testing';
import { userMock } from '@/tests/__mocks__/user.mock';
import { generateCartMock } from '@/tests/__mocks__/cart.mock';

const ctx = {
  i18n: {
    locale: 'en'
  },
  $cookies: {
    get: jest.fn(),
    set: jest.fn(),
    remove: jest.fn()
  },
  $vsf: {
    $epcc: {
      api: {
        createCart: jest.fn(),
        logoutCustomer: jest.fn()
      }
    }
  }
};

jest.mock('@nuxtjs/composition-api', () => ({
  ...jest.requireActual('@nuxtjs/composition-api'),
  useContext: () => ctx
}));

describe('[epcc-theme] useUser', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('setUser', () => {
    it('should set user', async () => {
      // arrange
      setActivePinia(createTestingPinia());
      const { user, setUser, isAuthenticated } = useUser();

      // act
      setUser(userMock);

      // assert
      expect(user.value).toEqual(userMock);
      expect(isAuthenticated.value).toBeTruthy();
    });
  });

  describe('load', () => {
    describe('happy path', () => {
      it('should return user', async () => {
        // arrange
        setActivePinia(createTestingPinia());
        ctx.$cookies.get.mockReturnValueOnce(userMock);
        const { load, user, isAuthenticated } = useUser();

        // act
        const response = await load();

        // assert
        expect(response).toEqual(userMock);
        expect(user.value).toEqual(userMock);
        expect(isAuthenticated).toBeTruthy();
      });
    });
  });

  describe('logout', () => {
    describe('happy path', () => {
      it('should log a user out', async () => {
        // arrange
        // create a mocked pinia instance
        const pinia = createTestingPinia({
          initialState: {
            ['user-store']: { user: userMock }
          }
        });
        // inject the mocked pinia to user store
        useUserStore(pinia);

        // get cart composable
        const { cart } = useCart();
        // and user composable
        const { user, error, loading, logout, isAuthenticated } = useUser();

        const cartMock = generateCartMock();
        const wishlistMock = generateCartMock();

        ctx.$vsf.$epcc.api.createCart.mockReturnValueOnce(cartMock).mockReturnValueOnce(wishlistMock);

        // act
        await logout();

        // assert
        expect(user.value).toBeNull();
        expect(loading.value).toBeFalsy();
        expect(error.value.logout).toBeNull();
        expect(isAuthenticated.value).toBeFalsy();
        expect(ctx.$cookies.set).toHaveBeenCalledTimes(2);
        expect(ctx.$cookies.remove).toHaveBeenCalledTimes(4);
        expect(cart.value).toEqual({ items: [], id: cartMock.id });
        expect(ctx.$vsf.$epcc.api.createCart).toHaveBeenCalledTimes(2);
      });
    });
  });
});

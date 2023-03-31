import { expect } from '@jest/globals';
import { setActivePinia } from 'pinia';
import { Context } from '@nuxt/types/app';
import { useUserBilling } from '@/composables';
import { createTestingPinia } from '@pinia/testing';
import { NuxtCookies } from 'cookie-universal-nuxt';
import { userMock } from '@/tests/__mocks__/user.mock';
import { addressMock } from '@/tests/__mocks__/address.mock';
import { ContextualizedEndpoints } from '@vsf-enterprise/epcc-api';

const ctx = {
  $vsf: {
    $epcc: {
      api: {} as Partial<ContextualizedEndpoints>
    }
  },
  $cookies: {} as Partial<NuxtCookies>
} as Partial<Context>;

jest.mock('@nuxtjs/composition-api', () => ({
  ...jest.requireActual('@nuxtjs/composition-api'),
  useContext: () => ctx
}));

describe('[epcc-theme] useUserBilling', () => {
  describe('load', () => {
    it('should load user billing successfully', async () => {
      // arrange
      setActivePinia(createTestingPinia());
      const { load, error, billing, loading } = useUserBilling();
      ctx.$cookies.get = jest.fn().mockReturnValue(userMock);
      ctx.$vsf.$epcc.api.getAddresses = jest
        .fn()
        .mockResolvedValueOnce([addressMock]);

      // act
      await load();

      // assert
      expect(loading.value).toBeFalsy();
      expect(error.value.load).toBeNull();
      expect(billing.value).toEqual([addressMock]);
      expect(ctx.$vsf.$epcc.api.getAddresses).toHaveBeenCalledWith({
        billing: true,
        customerId: userMock.id
      });
    });

    it('should return an empty array when user is not logged in', async () => {
      // arrange
      setActivePinia(createTestingPinia());
      const { load, error, billing, loading } = useUserBilling();
      ctx.$cookies.get = jest.fn().mockReturnValue(undefined);

      // act
      await load();

      // assert
      expect(loading.value).toBeFalsy();
      expect(error.value.load).toBeNull();
      expect(billing.value).toEqual([]);
    });

    it('should handle gracefully when getting all categories from the API throws', async () => {
      // arrange
      setActivePinia(createTestingPinia());
      const { load, error, billing, loading } = useUserBilling();
      const axiosErrorMock = {
        isAxiosError: true,
        response: { status: 401 }
      };
      ctx.redirect = jest.fn();
      ctx.$cookies.get = jest.fn().mockReturnValue(userMock);
      ctx.$vsf.$epcc.api.getAddresses = jest
        .fn()
        .mockRejectedValue(axiosErrorMock);

      // act
      await load();

      // assert
      expect(loading.value).toBeFalsy();
      expect(billing.value).toEqual([]);
      expect(error.value.load).toEqual(axiosErrorMock);
      expect(ctx.redirect).toHaveBeenCalledWith('/?forceLogin');
    });
  });

  describe('addAddress', () => {
    it('should create a billing address successfully', async () => {
      // arrange
      setActivePinia(createTestingPinia());
      const { addAddress, error, loading } = useUserBilling();
      ctx.$cookies.get = jest.fn().mockReturnValue(userMock);
      ctx.$vsf.$epcc.api.createAddress = jest
        .fn()
        .mockResolvedValueOnce(addressMock);

      // act
      const address = await addAddress({ address: addressMock });

      // assert
      expect(loading.value).toBeFalsy();
      expect(error.value.addAddress).toBeNull();
      expect(address).toEqual([addressMock]);
      expect(ctx.$vsf.$epcc.api.createAddress).toHaveBeenCalledWith({
        customerId: userMock.id,
        address: { ...addressMock, billing: true }
      });
    });

    it('should handle gracefully when getting all categories from the API throws', async () => {
      // arrange
      setActivePinia(createTestingPinia());
      const { addAddress, error, billing, loading } = useUserBilling();
      const axiosErrorMock = {
        isAxiosError: true,
        response: { status: 401 }
      };
      ctx.redirect = jest.fn();
      ctx.$cookies.get = jest.fn().mockReturnValue(userMock);
      ctx.$vsf.$epcc.api.createAddress = jest
        .fn()
        .mockRejectedValue(axiosErrorMock);

      // act
      await addAddress({ address: addressMock });

      // assert
      expect(loading.value).toBeFalsy();
      expect(billing.value).toEqual([]);
      expect(error.value.addAddress).toEqual(axiosErrorMock);
      expect(ctx.redirect).toHaveBeenCalledWith('/?forceLogin');
    });

    it('should add a new billing address successfully', async () => {
      // arrange
      const billingAddresses = [
        { ...addressMock, id: 'existing-address-id-1' },
        { ...addressMock, id: 'existing-address-id-2' }
      ];
      const newAddress = { ...addressMock, id: 'new-address-id' };
      setActivePinia(
        createTestingPinia({
          initialState: {
            'billing-store': {
              billing: billingAddresses
            }
          }
        })
      );
      const { addAddress, error, loading } = useUserBilling();
      ctx.$cookies.get = jest.fn().mockReturnValue(userMock);
      ctx.$vsf.$epcc.api.createAddress = jest
        .fn()
        .mockResolvedValueOnce(newAddress);

      // act
      const address = await addAddress({ address: newAddress });

      // assert
      expect(loading.value).toBeFalsy();
      expect(error.value.addAddress).toBeNull();
      expect(address).toEqual([...billingAddresses, newAddress]);
      expect(ctx.$vsf.$epcc.api.createAddress).toHaveBeenCalledWith({
        customerId: userMock.id,
        address: { ...newAddress, billing: true }
      });
    });
  });

  describe('updateAddress', () => {
    it('should update a billing address successfully', async () => {
      // arrange
      setActivePinia(
        createTestingPinia({
          initialState: {
            'billing-store': {
              billing: [
                { ...addressMock, id: '1' },
                { ...addressMock, id: '2' }
              ]
            }
          }
        })
      );
      const updatedAddress = {
        ...addressMock,
        id: '1',
        default_address: true
      };
      const { updateAddress, error, loading } = useUserBilling();
      ctx.$cookies.get = jest.fn().mockReturnValue(userMock);
      ctx.$vsf.$epcc.api.updateAddress = jest
        .fn()
        .mockResolvedValueOnce(updatedAddress);

      // act
      const address = await updateAddress({ address: updatedAddress });

      // assert
      expect(loading.value).toBeFalsy();
      expect(error.value.updateAddress).toBeNull();
      expect(address).toEqual([updatedAddress, { ...addressMock, id: '2' }]);
      expect(ctx.$vsf.$epcc.api.updateAddress).toHaveBeenCalledWith({
        customerId: userMock.id,
        address: updatedAddress
      });
    });

    it('should handle gracefully when getting all categories from the API throws', async () => {
      // arrange
      setActivePinia(createTestingPinia());
      const { updateAddress, error, billing, loading } = useUserBilling();
      const axiosErrorMock = {
        isAxiosError: true,
        response: { status: 401 }
      };
      ctx.redirect = jest.fn();
      ctx.$cookies.get = jest.fn().mockReturnValue(userMock);
      ctx.$vsf.$epcc.api.updateAddress = jest
        .fn()
        .mockRejectedValue(axiosErrorMock);

      // act
      await updateAddress({ address: addressMock });

      // assert
      expect(loading.value).toBeFalsy();
      expect(billing.value).toEqual([]);
      expect(error.value.addAddress).toEqual(axiosErrorMock);
      expect(ctx.redirect).toHaveBeenCalledWith('/?forceLogin');
    });
  });

  describe('deleteAddress', () => {
    it('should delete a billing address successfully', async () => {
      // arrange
      setActivePinia(
        createTestingPinia({
          initialState: {
            'billing-store': {
              billing: [
                { ...addressMock, id: '1' },
                { ...addressMock, id: '2' }
              ]
            }
          }
        })
      );
      const { deleteAddress, error, loading } = useUserBilling();
      ctx.$cookies.get = jest.fn().mockReturnValue(userMock);
      ctx.$vsf.$epcc.api.deleteAddress = jest.fn();

      // act
      const address = await deleteAddress({
        address: { ...addressMock, id: '1' }
      });

      // assert
      expect(loading.value).toBeFalsy();
      expect(error.value.updateAddress).toBeNull();
      expect(address).toEqual([{ ...addressMock, id: '2' }]);
      expect(ctx.$vsf.$epcc.api.deleteAddress).toHaveBeenCalledWith({
        addressId: '1',
        customerId: userMock.id
      });
    });
  });
});

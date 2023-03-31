import type { Context } from '@nuxt/types/app';
import type { NuxtCookies } from 'cookie-universal-nuxt';
import type { ContextualizedEndpoints } from '@vsf-enterprise/epcc-api';

import { expect } from '@jest/globals';
import { setActivePinia } from 'pinia';
import { useUserShipping } from '@/composables';
import { createTestingPinia } from '@pinia/testing';
import { userMock } from '@/tests/__mocks__/user.mock';
import { addressMock } from '@/tests/__mocks__/address.mock';

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

describe('[epcc-theme] useUserShipping', () => {
  describe('load', () => {
    it('should load user shipping successfully', async () => {
      // arrange
      setActivePinia(createTestingPinia());
      const { load, error, shipping, loading } = useUserShipping();
      ctx.$cookies.get = jest.fn().mockReturnValue(userMock);
      ctx.$vsf.$epcc.api.getAddresses = jest
        .fn()
        .mockResolvedValueOnce([addressMock]);

      // act
      await load();

      // assert
      expect(loading.value).toBeFalsy();
      expect(error.value.load).toBeNull();
      expect(shipping.value).toEqual([addressMock]);
      expect(ctx.$vsf.$epcc.api.getAddresses).toHaveBeenCalledWith({
        customerId: userMock.id
      });
    });

    it('should return an empty array when user is not logged in', async () => {
      // arrange
      setActivePinia(createTestingPinia());
      const { load, error, shipping, loading } = useUserShipping();
      ctx.$cookies.get = jest.fn().mockReturnValue(undefined);

      // act
      await load();

      // assert
      expect(loading.value).toBeFalsy();
      expect(error.value.load).toBeNull();
      expect(shipping.value).toEqual([]);
    });

    it('should handle gracefully when getting all categories from the API throws', async () => {
      // arrange
      setActivePinia(createTestingPinia());
      const { load, error, shipping, loading } = useUserShipping();
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
      expect(shipping.value).toEqual([]);
      expect(error.value.load).toEqual(axiosErrorMock);
      expect(ctx.redirect).toHaveBeenCalledWith('/?forceLogin');
    });
  });

  describe('addAddress', () => {
    it('should create a shipping address successfully', async () => {
      // arrange
      setActivePinia(createTestingPinia());
      const { addAddress, error, loading } = useUserShipping();
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
        address: { ...addressMock }
      });
    });

    it('should handle gracefully when getting all categories from the API throws', async () => {
      // arrange
      setActivePinia(createTestingPinia());
      const { addAddress, error, shipping, loading } = useUserShipping();
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
      expect(shipping.value).toEqual([]);
      expect(error.value.addAddress).toEqual(axiosErrorMock);
      expect(ctx.redirect).toHaveBeenCalledWith('/?forceLogin');
    });

    it('should add a new shipping address successfully', async () => {
      // arrange
      const shippingAddresses = [
        { ...addressMock, id: 'existing-address-id-1' },
        { ...addressMock, id: 'existing-address-id-2' }
      ];
      const newAddress = { ...addressMock, id: 'new-address-id' };
      setActivePinia(
        createTestingPinia({
          initialState: {
            'shipping-store': {
              shipping: shippingAddresses
            }
          }
        })
      );
      const { addAddress, error, loading } = useUserShipping();
      ctx.$cookies.get = jest.fn().mockReturnValue(userMock);
      ctx.$vsf.$epcc.api.createAddress = jest
        .fn()
        .mockResolvedValueOnce(newAddress);

      // act
      const address = await addAddress({ address: newAddress });

      // assert
      expect(loading.value).toBeFalsy();
      expect(error.value.addAddress).toBeNull();
      expect(address).toEqual([...shippingAddresses, newAddress]);
      expect(ctx.$vsf.$epcc.api.createAddress).toHaveBeenCalledWith({
        customerId: userMock.id,
        address: { ...newAddress }
      });
    });
  });

  describe('updateAddress', () => {
    it('should update a shipping address successfully', async () => {
      // arrange
      setActivePinia(
        createTestingPinia({
          initialState: {
            'shipping-store': {
              shipping: [
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
      const { updateAddress, error, loading } = useUserShipping();
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
      const { updateAddress, error, shipping, loading } = useUserShipping();
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
      expect(shipping.value).toEqual([]);
      expect(error.value.addAddress).toEqual(axiosErrorMock);
      expect(ctx.redirect).toHaveBeenCalledWith('/?forceLogin');
    });
  });

  describe('deleteAddress', () => {
    it('should delete a shipping address successfully', async () => {
      // arrange
      setActivePinia(
        createTestingPinia({
          initialState: {
            'shipping-store': {
              shipping: [
                { ...addressMock, id: '1' },
                { ...addressMock, id: '2' }
              ]
            }
          }
        })
      );
      const { deleteAddress, error, loading } = useUserShipping();
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

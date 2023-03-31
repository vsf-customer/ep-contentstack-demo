import type {
  UseUserShipping,
  UseUserShippingLoad,
  UseUserShippingAddAddress,
  UseUserShippingUpdateAddress,
  UseUserShippingDeleteAddress,
  UseUserShippingSetDefaultAddress
} from './types';
import {
  isApiError,
  forceLoginOnUnauthorizedResponse
} from '@/helpers/general';
import { storeToRefs } from 'pinia';
import { COOKIE_KEY_CUSTOMER_DATA } from '@/constants';
import { useUserShippingStore } from '@/store/shipping';
import { readonly, useContext } from '@nuxtjs/composition-api';

/**
 * @public
 *
 * The `useUserShipping` composable allows loading/creating/updating/deleting
 * a shipping address from Elastic Path API.
 * It is commonly used in checkout flow.
 * Provides the load, addAddress, updateAddress, deleteAddress, setDefaultAddress
 * functions and refs for the shipping addresses, loading, and error.
 */
export function useUserShipping(): UseUserShipping {
  const {
    $cookies,
    $vsf: { $epcc }
  } = useContext();

  const { error, shipping, loading } = storeToRefs(useUserShippingStore());

  const load: UseUserShippingLoad = async () => {
    try {
      loading.value = true;
      error.value.load = null;
      const customerId = $cookies.get(COOKIE_KEY_CUSTOMER_DATA)?.id;

      if (!customerId) {
        shipping.value = [];
        return;
      }

      shipping.value = (await $epcc.api.getAddresses({ customerId })) || [];
    } catch (err) {
      error.value.load = err;
      if (isApiError(err)) {
        await forceLoginOnUnauthorizedResponse(err);
      }
    } finally {
      loading.value = false;
    }
  };

  const addAddress: UseUserShippingAddAddress = async (params) => {
    try {
      loading.value = true;
      error.value.addAddress = null;

      const createdAddress = await $epcc.api.createAddress({
        address: params.address,
        customerId: $cookies.get(COOKIE_KEY_CUSTOMER_DATA)?.id
      });

      return (shipping.value = shipping.value
        ? [...shipping.value, createdAddress]
        : [createdAddress]);
    } catch (err) {
      error.value.addAddress = err;
      if (isApiError(err)) {
        await forceLoginOnUnauthorizedResponse(err);
      }
    } finally {
      loading.value = false;
    }
  };

  const updateAddress: UseUserShippingUpdateAddress = async (params) => {
    try {
      loading.value = true;
      error.value.addAddress = null;
      const updatedAddress = await $epcc.api.updateAddress({
        address: params.address,
        customerId: $cookies.get(COOKIE_KEY_CUSTOMER_DATA)?.id
      });

      return (shipping.value = shipping.value.map((item) => {
        if (item.id === params.address.id) {
          return updatedAddress;
        }

        return item;
      }));
    } catch (err) {
      error.value.addAddress = err;
      if (isApiError(err)) {
        await forceLoginOnUnauthorizedResponse(err);
      }
    } finally {
      loading.value = false;
    }
  };

  const deleteAddress: UseUserShippingDeleteAddress = async (params) => {
    try {
      loading.value = true;
      error.value.addAddress = null;
      await $epcc.api.deleteAddress({
        addressId: params.address.id,
        customerId: $cookies.get(COOKIE_KEY_CUSTOMER_DATA)?.id
      });

      return (shipping.value = shipping.value.filter(
        (item) => item.id !== params.address.id
      ));
    } catch (err) {
      error.value.addAddress = err;
      if (isApiError(err)) {
        await forceLoginOnUnauthorizedResponse(err);
      }
    } finally {
      loading.value = false;
    }
  };

  const setDefaultAddress: UseUserShippingSetDefaultAddress = async () => {
    console.log('not yet implemented');
  };

  return {
    error: readonly(error),
    loading: readonly(loading),
    shipping: readonly(shipping),
    load,
    addAddress,
    deleteAddress,
    updateAddress,
    setDefaultAddress
  };
}

export * from './types';

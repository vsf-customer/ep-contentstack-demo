import type {
  UseUserBilling,
  UseUserAddAddress,
  UseUserBillingLoad,
  UseUserDeleteAddress,
  UseUserUpdateAddress,
  UseUserSetDefaultAddress
} from './types';
import {
  isApiError,
  forceLoginOnUnauthorizedResponse
} from '@/helpers/general';
import { storeToRefs } from 'pinia';
import { useUserBillingStore } from '@/store/billing';
import { COOKIE_KEY_CUSTOMER_DATA } from '@/constants';
import { readonly, useContext } from '@nuxtjs/composition-api';

/**
 * @public
 *
 * The `useUserBilling` composable allows loading/creating/updating/deleting
 * a billing address from Elastic Path API.
 * It is commonly used in checkout flow.
 * Provides the load, addAddress, updateAddress, deleteAddress, setDefaultAddress
 * functions and refs for the billing addresses, loading, and error.
 */
export function useUserBilling(): UseUserBilling {
  const {
    $cookies,
    $vsf: { $epcc }
  } = useContext();

  const { error, billing, loading } = storeToRefs(useUserBillingStore());

  const load: UseUserBillingLoad = async () => {
    try {
      loading.value = true;
      error.value.load = null;
      const customerId = $cookies.get(COOKIE_KEY_CUSTOMER_DATA)?.id;

      if (!customerId) {
        return (billing.value = []);
      }

      const response = await $epcc.api.getAddresses({
        customerId,
        billing: true
      });

      return (billing.value = response);
    } catch (err) {
      error.value.load = err;
      if (isApiError(err)) {
        await forceLoginOnUnauthorizedResponse(err);
      }
    } finally {
      loading.value = false;
    }
  };

  const addAddress: UseUserAddAddress = async (params) => {
    try {
      loading.value = true;
      error.value.addAddress = null;
      const response = await $epcc.api.createAddress({
        address: { ...params.address, billing: true },
        customerId: $cookies.get(COOKIE_KEY_CUSTOMER_DATA)?.id
      });

      return (billing.value = [...billing.value, response]);
    } catch (err) {
      error.value.addAddress = err;
      if (isApiError(err)) {
        await forceLoginOnUnauthorizedResponse(err);
      }
    } finally {
      loading.value = false;
    }
  };

  const updateAddress: UseUserUpdateAddress = async (params) => {
    try {
      loading.value = true;
      error.value.addAddress = null;
      const response = await $epcc.api.updateAddress({
        address: params.address,
        customerId: $cookies.get(COOKIE_KEY_CUSTOMER_DATA)?.id
      });

      return (billing.value = billing.value.map((address) => {
        if (address.id === params.address.id) {
          return response;
        }

        return address;
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

  const deleteAddress: UseUserDeleteAddress = async (params) => {
    try {
      loading.value = true;
      error.value.addAddress = null;
      await $epcc.api.deleteAddress({
        addressId: params.address.id,
        customerId: $cookies.get(COOKIE_KEY_CUSTOMER_DATA)?.id
      });

      return (billing.value = billing.value.filter(
        (address) => address.id !== params.address.id
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

  const setDefaultAddress: UseUserSetDefaultAddress = async () => {
    console.log('not yet implemented');
  };

  return {
    error: readonly(error),
    loading: readonly(loading),
    billing: readonly(billing),
    load,
    addAddress,
    deleteAddress,
    updateAddress,
    setDefaultAddress
  };
}

export * from './types';

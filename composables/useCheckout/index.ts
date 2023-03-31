import type {
  UseCheckout,
  UseCheckoutClear,
  UseCheckoutSetCustomer,
  UseCheckoutPaymentMethod,
  UseCheckoutSetShippingMethod,
  UseCheckoutSetBillingAddress,
  UseCheckoutSetShippingAddress
} from './types';
import { useCheckoutStore } from '@/store/checkout';
import { COOKIE_KEY_CHECKOUT_DATA } from '@/constants';
import { readonly, useContext } from '@nuxtjs/composition-api';

/**
 * @public
 *
 * The `useCheckout` composable allows to interact on every single data
 * from the checkout flow.
 * Provides the setCustomer, setShippingAddress, setBillingAddress, setShippingMethod,
 * setPaymentMethod and clear functions and refs for the data stored in the cookies.
 */
export function useCheckout(): UseCheckout {
  const store = useCheckoutStore();
  const { $cookies } = useContext();

  /** @private */
  const persistDataToCookies = () => {
    $cookies.set(COOKIE_KEY_CHECKOUT_DATA, store.data);
  };

  const setCustomer: UseCheckoutSetCustomer = (params) => {
    store.data.customer = { ...store.data.customer, ...params };
    persistDataToCookies();
  };

  const setShippingAddress: UseCheckoutSetShippingAddress = (params) => {
    store.data.shipping_address = { ...store.data.shipping_address, ...params };
    persistDataToCookies();
  };

  /**
   * @public
   * @param params {CheckoutData['billing_address']} - Billing address
   * @param override [boolean] - if true, will override the existing billing address
   */
  const setBillingAddress: UseCheckoutSetBillingAddress = (
    params,
    { override = false } = {}
  ) => {
    store.data.billing_address = {
      ...(!override && store.data.billing_address),
      ...params
    };
    persistDataToCookies();
  };

  const setShippingMethod: UseCheckoutSetShippingMethod = (params) => {
    store.data.shipping_method = { ...store.data.shipping_method, ...params };
    persistDataToCookies();
  };

  const setPaymentMethod: UseCheckoutPaymentMethod = (params) => {
    store.data.payment_method = { ...store.data.payment_method, ...params };
    persistDataToCookies();
  };

  const clear: UseCheckoutClear = () => {
    Object.keys(store.data).forEach((key) => {
      store.data[key] = {};
    });
    $cookies.remove(COOKIE_KEY_CHECKOUT_DATA);
  };

  return {
    clear,
    setCustomer,
    setPaymentMethod,
    setShippingMethod,
    setBillingAddress,
    setShippingAddress,
    data: readonly(store.data)
  };
}

export * from './types';

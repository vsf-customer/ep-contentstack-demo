import type {
  TODO,
  Address,
  UserShippingAddress
} from '@vsf-enterprise/epcc-api';
import type { DeepReadonly, Ref } from '@nuxtjs/composition-api';

export interface UseUserShippingErrors {
  load: Error;
  addAddress: Error;
  deleteAddress: Error;
  updateAddress: Error;
  setDefaultAddress: Error;
}

// input params
type UseUserShippingInputParams = {
  address: Readonly<Address>;
};

// load
export type UseUserShippingLoad = () => Promise<void>;
// addAddress
export type UseUserShippingAddAddress = (
  params: UseUserShippingInputParams
) => Promise<UserShippingAddress>;
// updateAddress
export type UseUserShippingUpdateAddress = (
  params: UseUserShippingInputParams
) => Promise<UserShippingAddress>;
// deleteAddress
export type UseUserShippingDeleteAddress = (
  params: UseUserShippingInputParams
) => Promise<UserShippingAddress>;
// setDefaultAddress
export type UseUserShippingSetDefaultAddress = () => Promise<TODO>;

export interface UseUserShipping {
  error: DeepReadonly<Ref<UseUserShippingErrors>>;
  loading: DeepReadonly<Ref<boolean>>;
  shipping: DeepReadonly<Ref<UserShippingAddress>>;
  load: UseUserShippingLoad;
  addAddress: UseUserShippingAddAddress;
  updateAddress: UseUserShippingUpdateAddress;
  deleteAddress: UseUserShippingDeleteAddress;
  setDefaultAddress: UseUserShippingSetDefaultAddress;
}

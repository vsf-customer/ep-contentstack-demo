import type {
  TODO,
  UserBillingAddress,
  UserBillingAddressItem
} from '@vsf-enterprise/epcc-api';
import type { DeepReadonly, Ref } from '@nuxtjs/composition-api';

export interface UseUserBillingErrors {
  load: Error;
  addAddress: Error;
  deleteAddress: Error;
  updateAddress: Error;
  setDefaultAddress: Error;
}

type UseUserMutateAddressParams = {
  address: Readonly<UserBillingAddressItem>;
};

export type UseUserAddAddress = (
  params: UseUserMutateAddressParams
) => Promise<UserBillingAddress>;
export type UseUserDeleteAddress = (
  params: UseUserMutateAddressParams
) => Promise<UserBillingAddress>;
export type UseUserUpdateAddress = (
  params: UseUserMutateAddressParams
) => Promise<UserBillingAddress>;
export type UseUserBillingLoad = () => Promise<UserBillingAddress>;
export type UseUserSetDefaultAddress = () => Promise<TODO>

export interface UseUserBilling {
  error: DeepReadonly<Ref<UseUserBillingErrors>>;
  loading: DeepReadonly<Ref<boolean>>;
  billing: DeepReadonly<Ref<UserBillingAddress>>;
  load: UseUserBillingLoad;
  addAddress: UseUserAddAddress;
  deleteAddress: UseUserDeleteAddress;
  updateAddress: UseUserUpdateAddress;
  setDefaultAddress: UseUserSetDefaultAddress;
}

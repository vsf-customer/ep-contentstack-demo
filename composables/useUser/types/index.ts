import type { UseUserErrors } from '@vue-storefront/core';
import type { ComputedRef } from '@nuxtjs/composition-api';
import type { CustomerBase, User } from '@vsf-enterprise/epcc-api';

type UseUserUpdateParams = Omit<CustomerBase, 'name'> & {
  firstName: string;
  lastName: string;
  acceptsMarketingEmails?: boolean;
  validation: {
    email: string;
    password: string;
  };
};

type UseUserRegisterParams = {
  user: {
    email: string;
    password: string;
    lastName: string;
    firstName: string;
    acceptsMarketingEmails: boolean;
  };
};

type UseUserChangePasswordParams = {
  new: string;
  current: string;
};

type UseUserLoginParams = {
  user: {
    username: string;
    password: string;
  };
};

export type UseUserLoad = () => User;
export type UseUserLogin = (params: UseUserLoginParams) => Promise<User>;
export type UseUserLogout = () => Promise<void>;
export type UseUserSetUser = (value: User) => void;
export type UseUserRegister = (params: UseUserRegisterParams) => Promise<User>;
export type UseUserUpdateUser = (
  updatedUserData: { user: UseUserUpdateParams }
) => Promise<User>;
export type UseUserChangePassword = (
  params: UseUserChangePasswordParams
) => Promise<User>;
export type UseUserSetCartForCustomer = ({
  cartId,
  cookieKey
}: {
  cartId: string;
  cookieKey: string;
}) => Promise<void>;

export interface UseUser {
  user: ComputedRef<User>;
  error: ComputedRef<UseUserErrors>;
  loading: ComputedRef<boolean>;
  load: UseUserLoad;
  login: UseUserLogin;
  logout: UseUserLogout;
  setUser: UseUserSetUser;
  register: UseUserRegister;
  updateUser: UseUserUpdateUser;
  changePassword: UseUserChangePassword;
  isAuthenticated: ComputedRef<boolean>;
}

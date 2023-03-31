import type { ComputedRef } from '@nuxtjs/composition-api';
import type { ResetPasswordResponse } from '@vsf-enterprise/epcc-api';

export interface UseForgotPasswordErrors {
  setNew: Error;
  request: Error;
}

export interface UseForgotPasswordRequestParams {
  email: string;
}

export interface UseForgotPasswordSetNewParams {
  tokenValue: string;
  newPassword: string;
  customQuery?: Record<string, string>;
}

export type UseForgotPasswordSetNew = (
  params: UseForgotPasswordSetNewParams
) => Promise<void>;

export type UseForgotPasswordRequest = (
  params: UseForgotPasswordRequestParams
) => Promise<ResetPasswordResponse | void>;

export interface UseForgotPassword {
  error: ComputedRef<UseForgotPasswordErrors>;
  loading: ComputedRef<boolean>;
  setNew: UseForgotPasswordSetNew;
  request: UseForgotPasswordRequest;
}

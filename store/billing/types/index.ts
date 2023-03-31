import { UserBillingAddress } from '@vsf-enterprise/epcc-api';
import { UseUserBillingErrors } from '@/composables/useUserBilling';

export interface UseUserBillingStoreState {
  error: UseUserBillingErrors;
  billing: UserBillingAddress;
  loading: boolean;
}

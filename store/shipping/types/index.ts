import type { UserShippingAddress } from '@vsf-enterprise/epcc-api';
import type { UseUserShippingErrors } from '@/composables/useUserShipping';

export interface UseUserShippingStoreState {
  shipping: UserShippingAddress;
  error: UseUserShippingErrors;
  loading: boolean;
}

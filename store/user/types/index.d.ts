import type { User } from '@vsf-enterprise/epcc-api';
import { UseUserErrors } from '@vue-storefront/core';

export interface UseUserStoreState {
  user: User;
  loading: boolean;
  error: UseUserErrors;
}

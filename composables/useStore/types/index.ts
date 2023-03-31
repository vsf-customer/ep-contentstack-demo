import type {
  UseStoreErrors,
  UseStoreFactoryLoadParamArguments,
  UseStoreFactoryChangeParamArguments
} from '@vue-storefront/core';
import type { TODO } from '@vsf-enterprise/epcc-api';
import type { ComputedRef } from '@nuxtjs/composition-api';

export interface UseStore {
  load: (params: UseStoreFactoryLoadParamArguments) => TODO;
  change: (params: UseStoreFactoryChangeParamArguments) => TODO;
  response: ComputedRef<TODO>;
  loading: ComputedRef<boolean>;
  error: ComputedRef<UseStoreErrors>;
}

import type { TODO } from '@vsf-enterprise/epcc-api';
import type { ComputedRef } from '@nuxtjs/composition-api';

export interface UseShippingErrors {
  load: Error;
  save: Error;
}

export interface UseShipping {
  shipping: ComputedRef<TODO>;
  loading: ComputedRef<boolean>;
  error: ComputedRef<UseShippingErrors>;
  load: (params: TODO) => Promise<TODO>;
  save: (params: TODO) => Promise<TODO>;
}

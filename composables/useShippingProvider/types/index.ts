import type { ShippingMethod } from '@vsf-enterprise/epcc-api';
import type { DeepReadonly, Ref } from '@nuxtjs/composition-api';

export interface UseShippingProviderErrors {
  load: Error;
}

export type UseShippingProviderLoad = () => Promise<void>;

export interface UseShippingProvider {
  error: DeepReadonly<Ref<UseShippingProviderErrors>>;
  state: DeepReadonly<Ref<ShippingMethod[]>>;
  loading: DeepReadonly<Ref<boolean>>;
  load: UseShippingProviderLoad;
}

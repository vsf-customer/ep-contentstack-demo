import type { FacetSearchResult } from '@vue-storefront/core';
import type { UseFacetSearchParams } from '@/composables/useFacet';

export interface UseFacetStoreErrors {
  search: Error;
}

export interface UseFacetStoreState {
  loading: boolean;
  error: UseFacetStoreErrors;
  result: FacetSearchResult<UseFacetSearchParams>;
}

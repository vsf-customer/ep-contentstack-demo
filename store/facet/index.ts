
import type { UseFacetStoreState } from '@/store/facet/types';

import { defineStore } from 'pinia';

export const useFacetStore = (id?: string): any => defineStore(`facet-store-${id}`, {
  state: (): UseFacetStoreState => ({
    loading: false,
    error: { search: null },
    result: { data: null, input: null }
  })
})();

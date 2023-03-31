import type {
  UseFacetErrors,
  FacetSearchResult,
  AgnosticBreadcrumb,
  AgnosticPagination,
  AgnosticFacetSearchParams
} from '@vue-storefront/core';
import type { Product } from '@vsf-enterprise/epcc-api';
import type { ComputedRef } from '@nuxtjs/composition-api';
import type { EnhancedCategory } from '@/composables/useCategory';

export type UseFacetSearchParams = {
  facets: any[];
  locale?: string;
  products: Product[];
  categories: EnhancedCategory[];
  pagination: AgnosticPagination;
  breadcrumbs: AgnosticBreadcrumb[];
};

export interface UseFacet {
  loading: ComputedRef<boolean>;
  error: ComputedRef<UseFacetErrors>;
  result: ComputedRef<FacetSearchResult<UseFacetSearchParams>>;
  search: (params: AgnosticFacetSearchParams) => Promise<void>;
}

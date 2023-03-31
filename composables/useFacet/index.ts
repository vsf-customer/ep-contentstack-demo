import type {
  FacetSearchResult,
  AgnosticFacetSearchParams
} from '@vue-storefront/core';
import type { UseFacet, UseFacetSearchParams } from './types';
import type { ProductListResponse } from '@vsf-enterprise/epcc-api';

import {
  isApiError,
  forceLoginOnUnauthorizedResponse
} from '@/helpers/general';
import {
  getBreadcrumbs
} from '@/helpers/breadcrumbs';
import {
  enhancePagination,
  enhanceCategories
} from '@/composables/useCategory/helper/functions';
import { useCategory } from '@/composables';
import { useFacetStore } from '@/store/facet';
import { computed, useContext } from '@nuxtjs/composition-api';

/**
 * @public
 *
 * The `useFacet` composable allows searching from Elastic Path API.
 * Provides a search function and refs for the search result, loading, and error.
 */
export function useFacet(id?: string): UseFacet {
  const store = useFacetStore(id);
  const category = useCategory();
  const {
    $vsf: { $epcc }
  } = useContext();

  /** @private */
  const doSearch = async (
    params: FacetSearchResult<UseFacetSearchParams>
  ): Promise<UseFacetSearchParams> => {
    const [rootCategory, currentCategory, categories] = await Promise.all([
      category.getBySlug(params.input.rootCategorySlug),
      category.getBySlug(params.input.categorySlug),
      $epcc.api.getNodes({ limit: 100 })
    ]);

    const id = currentCategory?.id;

    if (!id && params.input.categorySlug) {
      throw { statusCode: 404, message: 'Category not found' };
    }

    let products: ProductListResponse;
    if (currentCategory?.id) {
      products = await $epcc.api.getProductsByNode({
        ...params.input,
        id: currentCategory?.id
      });
    } else {
      products = await $epcc.api.getProducts(params.input);
    }

    const pagination = enhancePagination(products?.meta);
    const enhancedCategories = enhanceCategories(
      categories,
      currentCategory?.id
    );
    const breadcrumbs = getBreadcrumbs(
      currentCategory,
      enhancedCategories,
      rootCategory
    );

    return {
      pagination,
      breadcrumbs,
      facets: [],
      products: products.data,
      categories: enhancedCategories
    };
  };

  /** @public */
  const search = async (params: AgnosticFacetSearchParams): Promise<void> => {
    store.result.input = params;
    try {
      store.loading = true;
      store.result.data = await doSearch(store.result);
      store.error.search = null;
    } catch (err) {
      store.error.search = err;
      if (isApiError(err)) {
        await forceLoginOnUnauthorizedResponse(err);
      }
    } finally {
      store.loading = false;
    }
  };

  return {
    search,
    error: computed(() => store.error),
    result: computed(() => store.result),
    loading: computed(() => store.loading)
  };
}

export * from './types';

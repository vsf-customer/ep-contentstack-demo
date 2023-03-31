import {
  isApiError,
  forceLoginOnUnauthorizedResponse
} from '@/helpers/general';
import {
  ref,
  Ref,
  ssrRef,
  computed,
  useContext
} from '@nuxtjs/composition-api';
import type {
  UseCategory,
  UseCategorySearch,
  UseCategoryGetBySlug,
  UseCategoryGetCatalog,
  UseCategoryGetAllCategories,
  UseCategoryGetHierarchyChildren
} from '@/composables/useCategory/types';
import {
  enhanceCategories,
  getMainHierarchyId
} from '@/composables/useCategory/helper/functions';
import type { Node } from '@moltin/sdk';
import type { UseCategoryErrors } from '@vue-storefront/core';
import type { EnhancedCategory } from '@/composables/useCategory';

/**
 * @public
 *
 * The `useCategory` composable allows loading categories from Elastic Path API.
 * It is commonly used in navigation menus and provides the load function and
 * refs for the categories, loading, and error.
 */
export function useCategory(category = 'main'): UseCategory {
  const {
    $vsf: { $epcc }
  } = useContext();

  const loading = ref(false);
  const categories: Ref<EnhancedCategory[]> = ssrRef([], category);
  const error: Ref<UseCategoryErrors> = ref({ search: null });

  const getBySlug: UseCategoryGetBySlug = async (slug, currentCategoryId) => {
    const results: Node[] = await $epcc.api.getNodes({
      filter: { eq: { slug } }
    });
    const categories = enhanceCategories(results, currentCategoryId);
    return categories?.[0];
  };

  const search: UseCategorySearch = async (params) => {
    const getCatalog: UseCategoryGetCatalog = async () => {
      try {
        loading.value = true;
        return await $epcc.api.getCatalogs({}).then((catalogs) => catalogs[0]);
      } catch (err) {
        error.value.search = err;
        if (isApiError(err)) await forceLoginOnUnauthorizedResponse(err);
      } finally {
        loading.value = false;
      }
    };

    const getAllCategories: UseCategoryGetAllCategories = async () => {
      try {
        loading.value = true;
        const { filter, limit, offset } = params;

        const results = await $epcc.api.getNodes({ limit, filter, offset });
        const currentCategory: EnhancedCategory = params?.currentCategorySlug
          ? await getBySlug(params.currentCategorySlug)
          : null;

        return enhanceCategories(results, currentCategory?.id);
      } catch (err) {
        error.value.search = err;
        if (isApiError(err)) {
          await forceLoginOnUnauthorizedResponse(err);
        }
      } finally {
        loading.value = false;
      }
    };

    const getHierarchyChildren: UseCategoryGetHierarchyChildren = async (
      hierarchyId
    ) => {
      try {
        loading.value = true;
        return await $epcc.api.getHierarchyChildren({
          id: hierarchyId
        });
      } catch (err) {
        error.value.search = err;
        if (isApiError(err)) {
          await forceLoginOnUnauthorizedResponse(err);
        }
      } finally {
        loading.value = false;
      }
    };

    if (params?.mainCategories) {
      const catalog = await getCatalog();
      const mainHierarchyId = getMainHierarchyId(catalog);
      const hierarchyChildren = await getHierarchyChildren(mainHierarchyId);
      categories.value = enhanceCategories(hierarchyChildren);
    } else {
      categories.value = await getAllCategories();
    }

    return categories.value;
  };

  return {
    error: computed(() => error.value),
    loading: computed(() => loading.value),
    categories: computed(() => categories.value),
    search,
    getBySlug
  };
}

export * from './types';

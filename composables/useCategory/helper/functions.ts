import themeConfig from '@/themeConfig';
import { isNode } from '@/helpers/general';
import type { Category } from '@/types/core';
import type { Hierarchy, Node } from '@moltin/sdk';
import type { AgnosticPagination } from '@vue-storefront/core';
import type { EnhancedCategory } from '@/composables/useCategory';
import type { ProductListResponse } from '@vsf-enterprise/epcc-api';

export const getMainHierarchyId = (catalog: Category): string =>
  catalog?.attributes?.hierarchy_ids?.[0] ?? '';

export const enhanceCategories = (
  categories: (Node | Hierarchy)[],
  currentCategoryId?: string
): EnhancedCategory[] => {
  if (!categories) return [];

  return categories.map((category) => ({
    ...category,
    isCurrent: currentCategoryId === category.id,
    parentId: isNode(category)
      ? category.relationships.parent?.data?.id
      : undefined
  }));
};

export const enhancePagination = (
  paginationMeta: ProductListResponse['meta']
): AgnosticPagination => ({
  itemsPerPage:
    paginationMeta?.page?.limit || themeConfig.defaultItemsPerPage || 24,
  currentPage: paginationMeta?.page?.current || 1,
  totalPages:
    paginationMeta?.results?.total && paginationMeta?.page?.limit
      ? Math.ceil(paginationMeta?.results?.total / paginationMeta?.page?.limit)
      : 1,
  totalItems: paginationMeta?.results?.total || 0,
  pageOptions: themeConfig.itemsPerPage ?? [24]
});

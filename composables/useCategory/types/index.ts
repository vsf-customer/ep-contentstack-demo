import type { ComputedRef } from '@nuxtjs/composition-api';
import type { Hierarchy, Catalog, Node } from '@moltin/sdk';
import type { GetNodesParams } from '@vsf-enterprise/epcc-api';
import type { CustomQuery, UseCategoryErrors } from '@vue-storefront/core';

export type UseCategorySearchParams = Pick<
  GetNodesParams,
  'filter' | 'limit' | 'offset'
> & {
  mainCategories?: boolean;
  currentCategorySlug?: string;
};

export type EnhancedCategory = (Node | Hierarchy) & {
  isCurrent: boolean;
  parentId?: string;
  count?: number;
};

export type CategoryTree = EnhancedCategory & {
  children?: CategoryTree[];
};

export interface UseCategoryCategorySearchParams
  extends UseCategorySearchParams {
  customQuery?: CustomQuery;
}

export type UseCategorySearch = (
  params: UseCategoryCategorySearchParams
) => Promise<EnhancedCategory[]>;
export type UseCategoryGetBySlug = (
  slug: string,
  currentCategoryId?: string
) => Promise<EnhancedCategory>;
export type UseCategoryGetCatalog = () => Promise<Catalog>;
export type UseCategoryGetAllCategories = () => Promise<EnhancedCategory[]>;
export type UseCategoryGetHierarchyChildren = (
  hierarchyId: string
) => Promise<Node[]>;

export interface UseCategory {
  loading: ComputedRef<boolean>;
  error: ComputedRef<UseCategoryErrors>;
  categories: ComputedRef<EnhancedCategory[]>;
  search: UseCategorySearch;
  getBySlug: UseCategoryGetBySlug;
}

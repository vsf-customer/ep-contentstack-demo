import {
  FacetSearchResult,
  AgnosticGroupedFacet,
  AgnosticPagination,
  AgnosticSort,
  AgnosticBreadcrumb
} from '@vue-storefront/core';
import type {
  Facet,
  FacetSearchCriteria,
  Product
} from '@vsf-enterprise/epcc-api';
import { useContext } from '@nuxtjs/composition-api';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useFacetData = () => {
  const { $config } = useContext();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function getGrouped(_params: FacetSearchResult<Facet>, _criteria?: FacetSearchCriteria
  ): AgnosticGroupedFacet[] {
    return [];
  }

  const getSortOptions = (
    searchData: FacetSearchResult<Facet>
  ): AgnosticSort => {
    const options = $config.theme?.product?.sortOptions ?? [];

    const selected = options.find(
      (option) => option.id === searchData.input?.sort
    )?.id;

    return { options, selected };
  };

  function getBreadcrumbs(
    params: FacetSearchResult<Facet>
  ): AgnosticBreadcrumb[] {
    return params.data?.breadcrumbs || [];
  }

  function getProducts(params: FacetSearchResult<Facet>): Product[] {
    return params.data?.products || [];
  }

  function getPagination(params: FacetSearchResult<Facet>): AgnosticPagination {
    if (!params.data?.pagination) {
      return {
        itemsPerPage: $config.theme?.defaultItemsPerPage ?? 24,
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        pageOptions: $config.theme?.itemsPerPage ?? [24]
      };
    }

    return params.data.pagination;
  }

  return {
    getSortOptions,
    getGrouped,
    getProducts,
    getBreadcrumbs,
    getPagination
  };
};

import type { EnhancedCategory } from '@/composables/useCategory';
import { useContext, useRoute, useRouter } from '@nuxtjs/composition-api';

const nonFilters = ['page', 'sort', 'term', 'itemsPerPage'];

const reduceFilters =
  (query: Record<string, string | string[]>) => (prev, curr: string) => {
    const makeArray = Array.isArray(query[curr]) || nonFilters.includes(curr);

    return {
      ...prev,
      [curr]: makeArray ? query[curr] : [query[curr]]
    };
  };

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useUiHelpers = () => {
  const route = useRoute();
  const router = useRouter();
  const { $config } = useContext();

  const getFiltersDataFromUrl = (onlyFilters: boolean) => {
    const { query } = route.value;

    return Object.keys(query)
      .filter((f) =>
        onlyFilters ? !nonFilters.includes(f) : nonFilters.includes(f)
      )
      .reduce(reduceFilters(query), {});
  };

  const getFacetsFromURL = () => {
    const { query, params } = route.value;
    const categorySlug = Object.keys(params).reduce(
      (prev, curr) => params[curr] || prev,
      params.slug_1
    );

    return {
      rootCatSlug: params.slug_1,
      categorySlug,
      page: parseInt(query.page as string, 10) || 1,
      sort: query.sort,
      filters: getFiltersDataFromUrl(true),
      itemsPerPage:
        parseInt(query.itemsPerPage as string, 10) ||
        $config.theme?.defaultItemsPerPage ||
        24,
      term: query.term
    };
  };

  const getCatLink = (category: EnhancedCategory): string => {
    return `/c${
      route.value.params.slug_1 ? `/${route.value.params.slug_1}` : ''
    }/${category.attributes.slug}`;
  };

  const getParentCatLink = (): string => {
    return `/c/${route.value.params.slug_1}`;
  };

  // eslint-disable-next-line
  const changeSorting = (sort) => {
    const { query } = route.value;
    router.push({ query: { ...query, sort } });
  };

  // eslint-disable-next-line
  const changeFilters = (filters) => {
    router.push({
      query: {
        ...getFiltersDataFromUrl(false),
        ...filters
      }
    });
  };

  // eslint-disable-next-line
  const changeItemsPerPage = (itemsPerPage) => {
    router.push({
      query: {
        ...getFiltersDataFromUrl(false),
        itemsPerPage,
        page: 1
      }
    });
  };

  // eslint-disable-next-line
  const setTermForUrl = (term: string) => {
    console.warn('[VSF] please implement useUiHelpers.changeSearchTerm.');
  };

  // eslint-disable-next-line
  const isFacetColor = (facet): boolean => {
    console.warn('[VSF] please implement useUiHelpers.isFacetColor.');

    return false;
  };

  // eslint-disable-next-line
  const isFacetCheckbox = (facet): boolean => {
    console.warn('[VSF] please implement useUiHelpers.isFacetCheckbox.');

    return false;
  };

  const getCategoryFromUrl = () => {
    return route.value.params.slug_2 || route.value.params.slug_1;
  };

  const getRootCategoryFromUrl = () => {
    return route.value.params.slug_1;
  };

  return {
    getCategoryFromUrl,
    getRootCategoryFromUrl,
    getFacetsFromURL,
    getCatLink,
    getParentCatLink,
    changeSorting,
    changeFilters,
    changeItemsPerPage,
    setTermForUrl,
    isFacetColor,
    isFacetCheckbox
  };
};

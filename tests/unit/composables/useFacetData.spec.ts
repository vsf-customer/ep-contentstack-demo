import { expect } from '@jest/globals';
import { Facet } from '@vsf-enterprise/epcc-api';
import { FacetSearchResult } from '@vue-storefront/core';

import { useFacetData } from '@/composables';
import { productMock } from '@/tests/__mocks__/product.mock';
import { categoriesMock } from '@/tests/__mocks__/categories.mock';

const defaultItemsPerPage = 25;
const itemsPerPage = [10, 15, 25];

jest.mock('@nuxtjs/composition-api', () => ({
  ...jest.requireActual('@nuxtjs/composition-api'),
  useContext: () => ({
    $config: {
      theme: {
        defaultItemsPerPage,
        itemsPerPage,
        product: {
          sortOptions: [
            { type: 'sort', id: '-updated_at', value: 'Most recently updated' },
            { type: 'sort', id: 'updated_at', value: 'Least recently updated' }
          ]
        }
      }
    }
  })
}));

describe('[epcc-theme] useFacetData', () => {
  const facetData = useFacetData();

  const breadcrumbsMock = [
    {
      link: '/c/men',
      text: 'Men'
    },
    {
      link: '/c/men/men-shoes',
      text: 'Shoes'
    }
  ];

  const facetMock: FacetSearchResult<Facet> = {
    data: {
      breadcrumbs: breadcrumbsMock,
      categories: categoriesMock,
      facets: [],
      products: [productMock],
      pagination: {
        itemsPerPage: 10,
        currentPage: 1,
        totalPages: 5,
        totalItems: 47,
        pageOptions: [10, 15, 20, 25, 50]
      }
    },
    input: {
      sort: 'updated_at'
    }
  };

  test('getSortOptions should return the id of the active sort option', () => {
    const sortSettings = facetData.getSortOptions(facetMock);

    expect(sortSettings.selected).toEqual(facetMock.input.sort);
  });

  describe('getBreadcrumbs', () => {
    it('should return the breadcrumbs from the data object of the given facet', () => {
      const breadcrumbs = facetData.getBreadcrumbs(facetMock);

      expect(breadcrumbs).toEqual(facetMock.data.breadcrumbs);
    });

    it('should return empty array when the data object does not have breadcrumbs', () => {
      const breadcrumbs = facetData.getBreadcrumbs({
        ...facetMock,
        data: { ...facetMock.data, breadcrumbs: undefined }
      });

      expect(breadcrumbs).toEqual([]);
    });
  });

  describe('getProducts', () => {
    it('should return the products from the data object of the given facet', () => {
      const products = facetData.getProducts(facetMock);

      expect(products).toEqual(facetMock.data.products);
    });

    it('should return empty array when the data object does not have products', () => {
      const products = facetData.getProducts({
        ...facetMock,
        data: { ...facetMock.data, products: undefined }
      });

      expect(products).toEqual([]);
    });
  });

  describe('getPagination', () => {
    it('should return the pagination from the data object of the given facet', () => {
      const pagination = facetData.getPagination(facetMock);

      expect(pagination).toEqual(facetMock.data.pagination);
    });

    it('should return a default value when the data object does not have pagination', () => {
      const pagination = facetData.getPagination({
        ...facetMock,
        data: { ...facetMock.data, pagination: undefined }
      });

      const expectedPagination = {
        itemsPerPage: defaultItemsPerPage,
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        pageOptions: itemsPerPage
      };

      expect(pagination).toEqual(expectedPagination);
    });
  });
});

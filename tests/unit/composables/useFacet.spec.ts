import { expect } from '@jest/globals';
import { setActivePinia } from 'pinia';
import { createTestingPinia } from '@pinia/testing';
import { AgnosticFacetSearchParams } from '@vue-storefront/core';

import { useFacet } from '@/composables';
import { productMock } from '@/tests/__mocks__/product.mock';
import { categoriesMock } from '@/tests/__mocks__/categories.mock';
import { getNodesMock, getProductByNodeMock } from '@/tests/__mocks__/category.mock';

const useContextMock = {
  $vsf: {
    $epcc: {
      api: {
        getNodes: jest.fn(),
        getProducts: jest.fn(),
        getProductsByNode: jest.fn()
      },
      config: {
        app: {
          context: {
            redirect: jest.fn()
          }
        }
      }
    }
  }
};

jest.mock('@nuxtjs/composition-api', () => ({
  ...jest.requireActual('@nuxtjs/composition-api'),
  useContext: () => useContextMock
}));

describe('[epcc-theme] useFacet', () => {
  const categorySlug = 'all-products';

  const expectedProducts = [productMock];
  const expectedCategories = categoriesMock.map((category) => ({
    ...category,
    isCurrent: category.attributes.slug === categorySlug,
    parentId: category.relationships?.parent?.data?.id
  }));

  beforeEach(() => {
    jest.resetAllMocks();
    setActivePinia(createTestingPinia());
  });

  describe('search', () => {
    it('should load all the categories', async () => {
      // arrange
      const { search, result, error } = useFacet();

      const params: AgnosticFacetSearchParams = {
        categorySlug,
        limit: 25,
        offset: 0,
        locale: 'en',
        rootCategorySlug: 'men'
      };

      useContextMock.$vsf.$epcc.api.getNodes.mockResolvedValue(getNodesMock());
      useContextMock.$vsf.$epcc.api.getProductsByNode.mockResolvedValue(
        getProductByNodeMock()
      );

      // act
      await search(params);

      // assert
      expect(useContextMock.$vsf.$epcc.api.getNodes).toHaveBeenCalledTimes(3);
      expect(useContextMock.$vsf.$epcc.api.getNodes).toHaveBeenNthCalledWith(
        1,
        { filter: { eq: { slug: params.rootCategorySlug } } }
      );
      expect(useContextMock.$vsf.$epcc.api.getNodes).toHaveBeenNthCalledWith(
        2,
        { filter: { eq: { slug: params.categorySlug } } }
      );
      expect(useContextMock.$vsf.$epcc.api.getNodes).toHaveBeenNthCalledWith(
        3,
        { limit: 100 }
      );
      expect(
        useContextMock.$vsf.$epcc.api.getProductsByNode
      ).toHaveBeenCalledTimes(1);
      expect(useContextMock.$vsf.$epcc.api.getProducts).toHaveBeenCalledTimes(
        0
      );

      expect(error.value.search).toBeNull();
      expect(result.value.data.products).toEqual(expectedProducts);
      expect(result.value.data.categories).toEqual(expectedCategories);
    });

    it('should throw an error when currentCategory is not found', async () => {
      // arrange
      const { search, error } = useFacet();
      const params = { categorySlug: 'qwerty', rootCategorySlug: 'men' };

      useContextMock.$vsf.$epcc.api.getNodes
        .mockResolvedValueOnce(getNodesMock())
        .mockResolvedValueOnce(
          getNodesMock({
            filter: {
              eq: {
                slug: params.categorySlug
              }
            }
          })
        )
        .mockResolvedValue(getNodesMock());

      // act
      await search(params);

      // assert
      expect(useContextMock.$vsf.$epcc.api.getNodes).toHaveBeenNthCalledWith(
        2,
        { filter: { eq: { slug: params.categorySlug } } }
      );
      expect(error.value.search).toEqual({
        message: 'Category not found',
        statusCode: 404
      });
      expect(useContextMock.$vsf.$epcc.api.getProducts).toHaveBeenCalledTimes(
        0
      );
      expect(
        useContextMock.$vsf.$epcc.api.getProductsByNode
      ).toHaveBeenCalledTimes(0);
    });
  });
});

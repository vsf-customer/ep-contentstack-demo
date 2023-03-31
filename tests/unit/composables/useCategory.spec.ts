import { expect } from '@jest/globals';
import { setActivePinia } from 'pinia';
import { createTestingPinia } from '@pinia/testing';
import { useCategory } from '@/composables';
import {
  getNodesMock,
  getCatalogsMock,
  getHierarchyChildrenMock
} from '@/tests/__mocks__/category.mock';

const useUserMock = {
  logout: jest.fn()
};

jest.mock('@/composables', () => ({
  ...jest.requireActual('@/composables'),
  useUser: () => useUserMock
}));

const useContextMock = {
  redirect: jest.fn(),
  i18n: {
    locale: 'en'
  },
  $vsf: {
    $epcc: {
      api: {
        getNodes: jest.fn(),
        getCatalogs: jest.fn(),
        getHierarchyChildren: jest.fn()
      }
    }
  }
};

jest.mock('@nuxtjs/composition-api', () => ({
  ...jest.requireActual('@nuxtjs/composition-api'),
  useContext: () => useContextMock
}));

setActivePinia(createTestingPinia());

describe('[epcc-theme] useCategory', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('search', () => {
    const { error, search, loading, categories } = useCategory();

    beforeEach(() => {
      error.value.search = null;
    });

    describe('when "currentCategorySlug" is provided', () => {
      describe('happy path', () => {
        it('should get the category if slug exists', async () => {
          // arrange
          const slug = 'all-products';
          const firstCallExpectedParams = { filter: { eq: { slug } } };
          const secondCallExpectedParams = {
            filter: undefined,
            offset: undefined,
            limit: undefined
          };
          useContextMock.$vsf.$epcc.api.getNodes.mockResolvedValue(
            getNodesMock().filter((node) => node.attributes.slug === slug)
          );

          // act
          await search({
            limit: undefined,
            filter: undefined,
            offset: undefined,
            currentCategorySlug: slug
          });

          // assert
          expect(error.value.search).toBeNull();
          expect(loading.value).toBe(false);
          expect(categories.value.length).toBe(1);
          expect(useContextMock.$vsf.$epcc.api.getNodes).toHaveBeenCalledWith(
            firstCallExpectedParams
          );
          expect(useContextMock.$vsf.$epcc.api.getNodes).toHaveBeenCalledWith(
            secondCallExpectedParams
          );
        });

        it('should return an empty array if slug does not exist', async () => {
          // arrange
          const slug = 'nonexistent-slug';
          const firstCallExpectedParams = { filter: { eq: { slug } } };
          const secondCallExpectedParams = {
            filter: undefined,
            offset: undefined,
            limit: undefined
          };
          useContextMock.$vsf.$epcc.api.getNodes.mockResolvedValue(
            getNodesMock().filter((node) => node.attributes.slug === slug)
          );

          // act
          await search({
            limit: undefined,
            filter: undefined,
            offset: undefined,
            currentCategorySlug: slug
          });

          // assert
          expect(error.value.search).toBeNull();
          expect(loading.value).toBe(false);
          expect(categories.value.length).toBe(0);
          expect(useContextMock.$vsf.$epcc.api.getNodes).toHaveBeenCalledWith(
            firstCallExpectedParams
          );
          expect(useContextMock.$vsf.$epcc.api.getNodes).toHaveBeenCalledWith(
            secondCallExpectedParams
          );
        });
      });

      describe('unhappy path', () => {
        it('should handle gracefully when getting all categories from the API throws', async () => {
          // arrange
          const slug = 'new-arrivals';
          const axiosErrorMock = {
            isAxiosError: true,
            response: { status: 401 }
          };
          const nodes = getNodesMock();
          useContextMock.$vsf.$epcc.api.getNodes
            // resolves
            .mockResolvedValueOnce(nodes)
            // rejects
            .mockRejectedValue(axiosErrorMock);

          // act
          await search({
            limit: undefined,
            filter: undefined,
            offset: undefined,
            currentCategorySlug: slug
          });

          // assert
          expect(loading.value).toBe(false);
          expect(error.value.search).toBe(axiosErrorMock);
          expect(useContextMock.$vsf.$epcc.api.getNodes).toHaveBeenCalledWith(
            {}
          );
          expect(useUserMock.logout).toHaveBeenCalledTimes(1);
          expect(useContextMock.redirect).toHaveBeenCalledWith('/?forceLogin');
        });
      });
    });

    describe('when "currentCategorySlug" is not provided', () => {
      it('should get categories offset by 2', async () => {
        // arrange
        const offset = 2;
        const params = { limit: undefined, filter: undefined, offset };
        useContextMock.$vsf.$epcc.api.getNodes.mockResolvedValueOnce(
          getNodesMock().slice(offset)
        );

        // act
        await search(params);

        // assert
        expect(error.value.search).toBeNull();
        expect(loading.value).toBe(false);
        expect(categories.value.length).toBe(3);
        expect(useContextMock.$vsf.$epcc.api.getNodes).toHaveBeenCalledWith(
          params
        );
      });

      it('should get categories limited by 5', async () => {
        // arrange
        const limit = 5;
        const params = { limit, filter: undefined, offset: undefined };

        useContextMock.$vsf.$epcc.api.getNodes.mockResolvedValueOnce(
          getNodesMock().slice(0, limit)
        );

        // act
        await search(params);

        // assert
        expect(error.value.search).toBeNull();
        expect(loading.value).toBe(false);
        expect(categories.value.length).toBe(5);
        expect(useContextMock.$vsf.$epcc.api.getNodes).toHaveBeenCalledWith(
          params
        );
      });

      it('should get filtered categories', async () => {
        // there are 2 categories with the ID containing "44"
        const byId = (category) => category.id.includes('44');
        const params = { filter: byId, limit: undefined, offset: undefined };

        useContextMock.$vsf.$epcc.api.getNodes.mockResolvedValueOnce(
          getNodesMock().filter(byId)
        );

        // act
        await search(params);

        // assert
        expect(error.value.search).toBeNull();
        expect(loading.value).toBe(false);
        expect(categories.value.length).toBe(2);
        expect(useContextMock.$vsf.$epcc.api.getNodes).toHaveBeenCalledWith(
          params
        );
      });

      it('should get categories limited by 2, offset by 2 and filtered by a condition', async () => {
        // arrange
        // from the list of categories, get first 2
        const limit = 2;
        // start introspection at index 2
        const offset = 2;
        // use this condition to filter the categories
        const byId = (category) => category.id.includes('44');
        const params = { limit, offset, filter: byId };

        useContextMock.$vsf.$epcc.api.getNodes.mockResolvedValueOnce(
          getNodesMock()
            .slice(offset, offset + limit)
            .filter(byId)
        );

        // act
        await search(params);

        // assert
        expect(error.value.search).toBeNull();
        expect(loading.value).toBe(false);
        expect(categories.value.length).toBe(2);
        expect(useContextMock.$vsf.$epcc.api.getNodes).toHaveBeenCalledWith(
          params
        );
      });
    });

    describe('when "mainCategories" is provided', () => {
      describe('happy path', () => {
        it('should get catalog children', async () => {
          // arrange
          const catalogMock = getCatalogsMock();
          const catalogHierarchyId =
            catalogMock[0].attributes.hierarchy_ids?.[0];
          // mock api fns
          useContextMock.$vsf.$epcc.api.getCatalogs.mockResolvedValue(
            catalogMock
          );
          useContextMock.$vsf.$epcc.api.getHierarchyChildren.mockResolvedValue(
            getHierarchyChildrenMock()
          );

          // act
          await search({
            limit: undefined,
            filter: undefined,
            offset: undefined,
            mainCategories: true
          });

          // assert
          expect(error.value.search).toBeNull();
          expect(loading.value).toBe(false);
          expect(categories.value.length).toBe(5);
          expect(
            useContextMock.$vsf.$epcc.api.getCatalogs
          ).toHaveBeenCalledWith({});
          expect(
            useContextMock.$vsf.$epcc.api.getHierarchyChildren
          ).toHaveBeenCalledWith({ id: catalogHierarchyId });
          categories.value.forEach((category: any) =>
            expect(category.relationships.hierarchy.data.id).toBe(
              catalogHierarchyId
            )
          );
        });
      });

      describe('unhappy path', () => {
        it('should handle gracefully when getting catalogs from the API throws', async () => {
          // arrange
          const axiosErrorMock = {
            isAxiosError: true,
            response: { status: 401 }
          };
          useContextMock.$vsf.$epcc.api.getCatalogs.mockRejectedValue(
            axiosErrorMock
          );

          // act
          await search({
            limit: undefined,
            filter: undefined,
            offset: undefined,
            mainCategories: true
          });

          // assert
          expect(loading.value).toBe(false);
          expect(error.value.search).toBe(axiosErrorMock);
          expect(categories.value.length).toBe(0);
          expect(
            useContextMock.$vsf.$epcc.api.getCatalogs
          ).toHaveBeenCalledWith({});
          expect(useUserMock.logout).toHaveBeenCalledTimes(1);
          expect(useContextMock.redirect).toHaveBeenCalledWith('/?forceLogin');
        });

        it('should handle gracefully when getting hierarchy children from the API throws', async () => {
          // arrange
          const axiosErrorMock = {
            isAxiosError: true,
            response: { status: 401 }
          };
          // mock api fns
          useContextMock.$vsf.$epcc.api.getCatalogs.mockResolvedValue(
            getCatalogsMock()
          );
          useContextMock.$vsf.$epcc.api.getHierarchyChildren.mockRejectedValue(
            axiosErrorMock
          );

          // act
          await search({
            limit: undefined,
            filter: undefined,
            offset: undefined,
            mainCategories: true
          });

          // assert
          expect(loading.value).toBe(false);
          expect(error.value.search).toBe(axiosErrorMock);
          expect(categories.value.length).toBe(0);
          expect(
            useContextMock.$vsf.$epcc.api.getCatalogs
          ).toHaveBeenCalledWith({});
          expect(useUserMock.logout).toHaveBeenCalledTimes(1);
          expect(useContextMock.redirect).toHaveBeenCalledWith('/?forceLogin');
        });
      });
    });
  });
});

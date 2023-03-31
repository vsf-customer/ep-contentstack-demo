import { Node, Catalog, Hierarchy } from '@moltin/sdk';
import { catalogMock } from '@/tests/__mocks__/catalog.mock';
import { productMock } from '@/tests/__mocks__/product.mock';
import { ProductListResponse } from '@vsf-enterprise/epcc-api';
import { categoriesMock } from '@/tests/__mocks__/categories.mock';

export const getNodesMock = (params?: {
  filter?: { eq?: { slug?: string } };
}): Node[] => {
  if (params?.filter?.eq?.slug) {
    return categoriesMock.filter(
      (category) => category.attributes.slug === params.filter.eq.slug
    );
  }

  return categoriesMock;
};

export const getCatalogsMock = (): Catalog[] => [catalogMock];

export const getProductsMock = (): ProductListResponse => ({
  data: [productMock]
});

export const getProductByNodeMock = (): ProductListResponse => ({
  data: [productMock]
});

export const getHierarchyChildrenMock = (): Hierarchy[] =>
  categoriesMock.map((category) => ({
    ...category,
    isCurrent: false,
    parentId: category.relationships?.parent?.data?.id
  }));

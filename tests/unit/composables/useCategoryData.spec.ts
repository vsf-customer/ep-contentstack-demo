import { expect } from '@jest/globals';
import { useCategoryData } from '@/composables';
import type { EnhancedCategory } from '@/composables/useCategory';
import { categoriesMock } from '@/tests/__mocks__/categories.mock';

describe('[epcc-theme] useCategoryData', () => {
  const categoryMock: EnhancedCategory = categoriesMock[1];
  const categoryData = useCategoryData();

  describe('getTree', () => {
    it('should return a tree from categories list', () => {
      const slugOfRoot = 'women';
      const expectedSubCategories = [
        { name: 'Accessories', subCategories: 1 },
        { name: 'Shorts', subCategories: 0 }
      ];

      const categoryTree = categoryData.getTree(slugOfRoot, categoriesMock);

      const subCategories = categoryTree.children;

      expect(categoryTree.attributes.slug).toEqual(slugOfRoot);
      expect(subCategories.length).toEqual(2);

      subCategories.forEach((subCategory, index) => {
        expect(expectedSubCategories.map((subCat) => subCat.name)).toContain(
          subCategory.attributes.name
        );

        expect(expectedSubCategories[index].subCategories).toEqual(
          subCategory.children?.length ?? 0
        );
      });
    });

    it('should return undefined when the rootCategory is not found', () => {
      const slugOfRoot = 'qwerty';

      const categoryTree = categoryData.getTree(slugOfRoot, categoriesMock);

      expect(categoryTree).toEqual(undefined);
    });
  });

  describe('getName', () => {
    it('should return the name of the category', () => {
      expect(categoryData.getName(categoryMock)).toEqual(
        categoryMock.attributes.name
      );
    });

    it('should return empty string when category is not defined', () => {
      expect(categoryData.getName(undefined)).toEqual('');
    });
  });

  describe('getSlug', () => {
    it('should return the slug attribute of the category', () => {
      expect(categoryData.getSlug(categoryMock)).toEqual(
        categoryMock.attributes.slug
      );
    });

    it('should return empty string when category is not defined', () => {
      expect(categoryData.getSlug(undefined)).toEqual('');
    });
  });

  describe('getDescription', () => {
    it('should return the name of the category', () => {
      expect(categoryData.getDescription(categoryMock)).toEqual(
        categoryMock.attributes.name
      );
    });

    it('should return empty string when category is not defined', () => {
      expect(categoryData.getDescription(undefined)).toEqual('');
    });
  });

  describe('getActiveSubCategory', () => {
    it('should find the given category recursively', () => {
      const categoryTree = categoryData.getTree('women', categoriesMock);

      const expectedCategory = categoriesMock[2];
      const expectedSubCategory = categoryTree.children.find(
        (child) => child.id === expectedCategory.id
      );

      const activeSubCategory = categoryData.getActiveSubCategory(
        categoriesMock[1],
        categoryTree
      );

      expect(activeSubCategory).toEqual(expectedSubCategory);
    });

    it('should return undefined when one of the params are not provided', () => {
      const categoryTree = categoryData.getTree('women', categoriesMock);

      expect(
        categoryData.getActiveSubCategory(undefined, categoryTree)
      ).toEqual(undefined);

      expect(
        categoryData.getActiveSubCategory(categoriesMock[2], undefined)
      ).toEqual(undefined);
    });
  });
});

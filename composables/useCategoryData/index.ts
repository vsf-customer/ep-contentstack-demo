import { capitalCase } from 'change-case';
import type { CategoryTree, EnhancedCategory } from '@/composables/useCategory';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useCategoryData = () => {
  const getCategoryWithChildren = (
    current: EnhancedCategory,
    categories: EnhancedCategory[]
  ): CategoryTree => {
    const children = categories?.reduce?.((children, cat) => {
      if (cat.parentId === current.id) {
        children.push(getCategoryWithChildren(cat, categories));
      }

      return children;
    }, []);

    return {
      ...current,
      children
    };
  };

  function getTree(
    rootCategorySlug: string,
    categories?: EnhancedCategory[]
  ): CategoryTree {
    const currentCategory = categories?.find(
      (category) => getSlug(category) === rootCategorySlug
    );

    if (currentCategory) {
      return getCategoryWithChildren(currentCategory, categories);
    }

    return currentCategory;
  }

  function getName(category: EnhancedCategory): string {
    return capitalCase(category?.attributes.name ?? '');
  }

  function getSlug(category: EnhancedCategory): string {
    return category?.attributes.slug ?? '';
  }

  function getDescription(category: EnhancedCategory): string {
    return category?.attributes.description ?? '';
  }

  function getActiveSubCategory(
    activeCategory: EnhancedCategory,
    categoryTree: CategoryTree
  ): CategoryTree | undefined {
    const subCategories = categoryTree?.children;

    if (!activeCategory) {
      return undefined;
    }

    return subCategories?.find(
      (subCategory) =>
        subCategory.id === activeCategory.id ||
        getActiveSubCategory(activeCategory, subCategory)
    );
  }

  return {
    getTree,
    getName,
    getSlug,
    getDescription,
    getActiveSubCategory
  };
};

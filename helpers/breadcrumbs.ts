import { capitalCase } from 'change-case';
import type { AgnosticBreadcrumb } from '@vue-storefront/core';
import type { EnhancedCategory } from '@/composables/useCategory';

export const getBreadcrumbs = (
  currentCategory: EnhancedCategory,
  categories: EnhancedCategory[],
  mainCategory: EnhancedCategory
): AgnosticBreadcrumb[] => {
  const crumbs = [];
  const urlChunks = [];

  if (!currentCategory || !categories || !mainCategory) {
    return crumbs;
  }

  const buildCrumbs = (currCategory, level = 0) => {
    const parent = categories.find(
      (category) => category.id === currCategory.parentId
    );
    if (parent && parent.parentId !== null) {
      urlChunks.push(currCategory.attributes.slug);
      buildCrumbs(parent, level + 1);

      const link = `/c/${urlChunks.slice(level).reverse().join('/')}`;

      crumbs.push({
        text: capitalCase(currCategory.attributes.name ?? ''),
        link
      });
    }
  };

  buildCrumbs(currentCategory);

  return crumbs;
};

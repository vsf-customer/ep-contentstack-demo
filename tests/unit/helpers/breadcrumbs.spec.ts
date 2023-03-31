import { expect } from '@jest/globals';
import { getBreadcrumbs } from '@/helpers';
import { categoriesMock } from '@/tests/__mocks__/categories.mock';

describe('[epcc-theme] breadcrumbs helper', () => {
  it('should return the array of objects containing category name and links to it in hierarchy order', () => {
    const mainCategory = categoriesMock[3];
    const currentCategory = categoriesMock[1];

    const expectedResponse = [
      { text: 'Women', link: '/c/women' },
      { text: 'Accessories', link: '/c/women/women-accessories' },
      { text: 'Socks', link: '/c/women/women-accessories/women-socks' }
    ];

    const breadcrumbs = getBreadcrumbs(
      currentCategory,
      categoriesMock,
      mainCategory
    );

    expect(breadcrumbs).toEqual(expectedResponse);
  });

  it('should return empty category name if node\'s name not provided', () => {
    const mainCategory = categoriesMock[3];
    const currentCategory = categoriesMock[1];
    const expectedResponse = [
      { text: '', link: '/c/women' },
      { text: 'Accessories', link: '/c/women/women-accessories' },
      { text: 'Socks', link: '/c/women/women-accessories/women-socks' }
    ];

    delete mainCategory.attributes.name;

    const breadcrumbs = getBreadcrumbs(
      currentCategory,
      categoriesMock,
      mainCategory
    );

    expect(breadcrumbs).toEqual(expectedResponse);
  });

  it('should return an empty array when params missing', () => {
    expect(getBreadcrumbs(
      undefined,
      categoriesMock,
      categoriesMock[3]
    )).toEqual([]);

    expect(getBreadcrumbs(
      categoriesMock[1],
      undefined,
      categoriesMock[3]
    )).toEqual([]);

    expect(getBreadcrumbs(
      categoriesMock[3],
      categoriesMock,
      undefined
    )).toEqual([]);
  });
});

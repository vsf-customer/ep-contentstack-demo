import { expect } from '@jest/globals';
import { setActivePinia } from 'pinia';
import { useCartStore } from '@/store/cart';
import { useProductData } from '@/composables';
import { createTestingPinia } from '@pinia/testing';
import { productMock } from '@/tests/__mocks__/product.mock';
import { generateCartMock } from '@/tests/__mocks__/cart.mock';
import { themeConfigMock } from '@/tests/__mocks__/themeConfig.mock';

const cartItemProductId = '65e8f8e0-f8e0-4f0e-b7b7-b671afc277ed';

jest.mock('@nuxtjs/composition-api', () => ({
  ...jest.requireActual('@nuxtjs/composition-api'),
  useContext: () => ({
    $config: {
      theme: themeConfigMock
    },
    i18n: {
      locale: 'en'
    },
    $vsf: {
      $epcc: {}
    }
  })
}));

setActivePinia(createTestingPinia());

describe('[epcc-theme] useProductData', () => {
  const productData = useProductData();

  describe('getName', () => {
    it('should return the name of the product', () => {
      expect(productData.getName(productMock)).toEqual(
        productMock.attributes.name
      );
    });

    it('should return a default value when product is not defined', () => {
      expect(productData.getName(undefined)).toEqual("Product's name");
    });
  });

  describe('getSlug', () => {
    test('should return the slug attribute of the product', () => {
      expect(productData.getSlug(productMock)).toEqual(
        productMock.attributes.slug
      );
    });

    test('should return empty string when product is not defined', () => {
      expect(productData.getSlug(undefined)).toEqual('');
    });
  });

  describe('getPrice', () => {
    it('should return price object', () => {
      const priceData = productData.getPrice(productMock);

      expect(priceData.regular).toEqual('$199.99');
      expect(priceData.special).toEqual(undefined);
    });

    it('should return 0 values when product is not defined', () => {
      const priceData = productData.getPrice(undefined);

      expect(priceData.regular).toEqual(0);
      expect(priceData.special).toEqual(0);
    });
  });

  describe('getTiers', () => {
    it('should return the array of tiered prices', () => {
      const tiers = productData.getTiers(productMock);

      const expectedTiers = [
        { minimum_quantity: 15, price: { regular: '$1.00' } },
        { minimum_quantity: 30, price: { regular: '$0.50' } }
      ];

      expect(tiers).toEqual(expectedTiers);
    });

    it('should return empty array when product is not defined', () => {
      const tiers = productData.getTiers(undefined);

      expect(tiers).toEqual([]);
    });
  });

  describe('getGallery', () => {
    it('should map product files', () => {
      const expectedGallery = productMock.files.map((file) => ({
        small: file.link.href,
        normal: file.link.href,
        big: file.link.href
      }));

      expect(productData.getGallery(productMock)).toEqual(expectedGallery);
    });

    it('should map the placeholder image when product is not defined', () => {
      const expectedGallery = themeConfigMock.product.placeholderImage.map(
        (placeholder) => ({
          small: placeholder.url,
          normal: placeholder.url,
          big: placeholder.url
        })
      );

      expect(productData.getGallery(undefined)).toEqual(expectedGallery);
    });
  });

  describe('getCoverImage', () => {
    it('should return the url of the main image', () => {
      expect(productData.getCoverImage(productMock)).toEqual(
        productMock.main_image.link.href
      );
    });

    it('should return the first product file when no main image is present', () => {
      const productMockWithoutMainImage = {
        ...productMock,
        main_image: undefined
      };

      expect(productData.getCoverImage(productMockWithoutMainImage)).toEqual(
        productMockWithoutMainImage.files[0].link.href
      );
    });

    it('should return empty string when product is not defined', () => {
      expect(productData.getCoverImage(undefined)).toEqual('');
    });
  });

  describe('getDescription', () => {
    it('should return the description of the product', () => {
      expect(productData.getDescription(productMock)).toEqual(
        productMock.attributes.description
      );
    });

    it('should return empty string when product is not defined', () => {
      expect(productData.getDescription(undefined)).toEqual('');
    });
  });

  describe('getCategoryIds', () => {
    it('should return the list of category ids for the product', () => {
      const categoryIds = ['43243', '31237'];

      const productMockWithCategories = {
        ...productMock,
        relationships: {
          ...productMock.relationships,
          categories: categoryIds.map((id) => ({ id, node_type: 'category' }))
        }
      };

      expect(productData.getCategoryIds(productMockWithCategories)).toEqual(
        categoryIds
      );
    });

    it('should return empty array when product is not defined', () => {
      expect(productData.getCategoryIds(undefined)).toEqual([]);
    });
  });

  describe('getId', () => {
    it('should return the id of the product as string', () => {
      expect(productData.getId(productMock)).toEqual(productMock.id);
    });

    it('should return empty string when product is not defined', () => {
      expect(productData.getId(undefined)).toEqual('');
    });
  });

  describe('getAttribute', () => {
    it('should select a value from the product extensions and return it', () => {
      const attributeName = 'brand';
      const attributeValue = productData.getAttribute(
        productMock,
        attributeName
      );

      const expectedValue =
        productMock.attributes.extensions['products(extension)'][attributeName];

      expect(attributeValue).toEqual(expectedValue);
    });

    it('should return empty string when product or attributeName are not defined or the given attribute is not a product extension', () => {
      expect(productData.getAttribute(undefined, 'brand')).toEqual('');
      expect(productData.getAttribute(productMock, undefined)).toEqual('');
      expect(productData.getAttribute(productMock, 'testAttribute')).toEqual(
        ''
      );
    });
  });

  describe('getExtensionAttributes', () => {
    it('should return the list of product extensions', () => {
      const expectedExtensions = [
        'brand',
        'hot',
        'meta_description',
        'meta_keyword',
        'meta_title',
        'new',
        'on_sale',
        'short_description'
      ];

      expect(productData.getExtensionAttributes(productMock)).toEqual(
        expectedExtensions
      );
    });

    it('should return empty array when product is not defined', () => {
      expect(productData.getExtensionAttributes(undefined)).toEqual([]);
    });
  });

  describe('getOptions', () => {
    it('should return the array of options configured on the product', () => {
      const expectedOptions = {
        color: [
          {
            description: 'red color',
            id: 'a44ee867-b62a-4db6-9218-32212f1070f2',
            label: 'red color',
            name: 'Red',
            value: 'Red'
          },
          {
            description: 'Blue color',
            id: '72771b45-5227-44e5-a0f8-4da9be6795a0',
            label: 'Blue color',
            name: 'Blue',
            value: 'Blue'
          }
        ],
        material: [
          {
            description: 'Cotton',
            id: 'ca18dad8-3ba1-4a5d-94a6-b7c4842b1027',
            label: 'Cotton',
            name: 'Cotton',
            value: 'Cotton'
          },
          {
            description: 'Poliester',
            id: 'cb74e704-c980-4cae-b24d-9c40d35526f7',
            label: 'Poliester',
            name: 'poliester',
            value: 'poliester'
          }
        ],
        size: [
          {
            description: 'Small',
            id: '03b4985a-4a12-4cbc-88f5-d321f5fe1d9b',
            label: 'Small',
            name: 'sm',
            value: 'sm'
          },
          {
            description: 'Large',
            id: 'ac0a8771-6ab1-4862-ab54-68cc3de2e04b',
            label: 'Large',
            name: 'lg',
            value: 'lg'
          }
        ]
      };

      expect(productData.getOptions(productMock)).toEqual(expectedOptions);
    });

    it('should return a subset of options configured on the product when the filter parameter is given', () => {
      expect(productData.getOptions(productMock, ['material'])).toEqual({
        material: [
          {
            description: 'Cotton',
            id: 'ca18dad8-3ba1-4a5d-94a6-b7c4842b1027',
            label: 'Cotton',
            name: 'Cotton',
            value: 'Cotton'
          },
          {
            description: 'Poliester',
            id: 'cb74e704-c980-4cae-b24d-9c40d35526f7',
            label: 'Poliester',
            name: 'poliester',
            value: 'poliester'
          }
        ]
      });
    });

    it('should return empty array when the product is not defined', () => {
      expect(productData.getOptions(undefined)).toEqual({});
    });
  });

  describe('getActiveVariantId', () => {
    it('should return the id of the variant based on the given configuration', () => {
      const activeVariantId = productData.getActiveVariantId(productMock, {
        color: 'Red',
        material: 'Cotton',
        size: 'sm'
      });

      const expectedVariantId = '343174fc-3a9f-4d51-b388-08ddbc8147fe';

      expect(activeVariantId).toEqual(expectedVariantId);
    });

    it('should return undefined when product or configuration are not defined', () => {
      expect(
        productData.getActiveVariantId(undefined, {
          color: 'Red',
          material: 'Cotton',
          size: 'sm'
        })
      ).toEqual(undefined);
      expect(productData.getActiveVariantId(productMock, undefined)).toEqual(
        undefined
      );
    });
  });

  describe('hasStock', () => {
    it('should check whether the available quantity of the product is higher than the out of stock limit', () => {
      expect(productData.hasStock(productMock)).toEqual(true);
    });

    it('should return true when the product has no inventory information', () => {
      const product = { ...productMock, inventory: undefined };

      expect(productData.hasStock(product)).toEqual(true);
    });

    it('should check the stock of the components', () => {
      const product = {
        ...productMock,
        component_products: [
          {
            ...productMock,
            inventory: {
              id: productMock.id,
              type: 'stock',
              total: 20,
              available: 0,
              allocated: 20
            }
          }
        ]
      };

      expect(productData.hasStock(product)).toEqual(false);
    });

    it('should subtract the cart quantity from the available quantity', async () => {
      // arrange
      const pinia = createTestingPinia();
      const cartStore = useCartStore();
      cartStore.cart = generateCartMock({
        items: [
          {
            product_id: cartItemProductId,
            quantity: productMock.inventory.available
          }
        ]
      });
      setActivePinia(pinia);
      const { hasStock } = useProductData();

      const product = {
        ...productMock,
        id: cartItemProductId
      };

      // assert
      expect(hasStock(product)).toEqual(false);
    });

    it('should return true when the available quantity is higher than the given quantity', () => {
      expect(productData.hasStock(productMock, 10)).toEqual(true);
    });

    it('should return false when the available quantity is lower than the given quantity', () => {
      expect(productData.hasStock(productMock, 200)).toEqual(false);
    });

    it('should check the stock of the components', () => {
      const available = 10;

      const product = {
        ...productMock,
        component_products: [
          {
            ...productMock,
            inventory: {
              id: productMock.id,
              type: 'stock',
              total: 20,
              available,
              allocated: 10
            }
          }
        ]
      };

      expect(productData.hasStock(product, available + 1)).toEqual(false);
    });

    it('should subtract the cart quantity from the available quantity', () => {
      // arrange
      const pinia = createTestingPinia();

      pinia.state.value['cart-store'] = {
        cart: generateCartMock({
          items: [
            {
              product_id: cartItemProductId,
              quantity: productMock.inventory.available
            }
          ]
        })
      };
      setActivePinia(pinia);
      const { hasStock } = useProductData();

      const product = {
        ...productMock,
        id: cartItemProductId,
        inventory: {
          ...productMock.inventory,
          available: productMock.inventory.available + 4
        }
      };

      // assert
      expect(hasStock(product, 5)).toEqual(false);
      expect(hasStock(product, 2)).toEqual(true);
    });
  });

  describe('isLowOnStock', () => {
    it('return false when there is a lot of stock available', () => {
      expect(productData.isLowOnStock(productMock)).toEqual(false);
    });

    it('return true when only a few items are available', () => {
      const product = {
        ...productMock,
        inventory: {
          ...productMock.inventory,
          available: 2
        }
      };

      expect(productData.isLowOnStock(product)).toEqual(true);
    });

    it('should check the stock of the components', () => {
      const product = {
        ...productMock,
        component_products: [
          {
            ...productMock,
            inventory: {
              id: productMock.id,
              type: 'stock',
              total: 20,
              available: 5,
              allocated: 15
            }
          }
        ]
      };

      expect(productData.isLowOnStock(product)).toEqual(true);
    });
  });
});

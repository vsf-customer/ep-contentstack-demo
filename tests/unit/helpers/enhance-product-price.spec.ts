import { expect } from '@jest/globals';
import { setActivePinia } from 'pinia';
import { createTestingPinia } from '@pinia/testing';
import { enhanceProductPrice } from '@/helpers';
import { productMock } from '../../__mocks__/product.mock';
import { themeConfigMock } from '@/tests/__mocks__/themeConfig.mock';

const ctx = {
  $config: {
    theme: themeConfigMock
  },
  i18n: {
    locale: 'en'
  },
  $vsf: {
    $epcc: {
      api: {}
    }
  }
};

jest.mock('@nuxtjs/composition-api', () => ({
  ...jest.requireActual('@nuxtjs/composition-api'),
  useContext: () => ctx
}));

setActivePinia(createTestingPinia());

describe('[epcc-composables] enhanceProductPrice helper', () => {
  it('should return the regular price only when there is no original display price on the product', () => {
    const price = enhanceProductPrice(productMock);

    expect(price).toEqual({
      regular: productMock.meta.display_price.without_tax.formatted
    });
  });

  it('should return the regular and special price when there is original display price on the product', async () => {
    const originalPrice = {
      USD: {
        amount: 24999,
        includes_tax: true,
        formatted: '$249.99'
      }
    };

    const price = enhanceProductPrice({
      ...productMock,
      meta: {
        ...productMock.meta,
        original_price: originalPrice
      }
    });

    const expectedPrice = {
      regular: originalPrice.USD.formatted,
      special: productMock.meta.display_price.without_tax.formatted
    };

    expect(price).toEqual(expectedPrice);
  });
});

import { AgnosticPrice } from '@vue-storefront/core';
import { Product } from '@vsf-enterprise/epcc-api';
import { useContext } from '@nuxtjs/composition-api';
import { currencyFormatter } from './currency-formatter';
import { useLocale } from '@/composables';

export const enhanceProductPrice = (product: Product): AgnosticPrice => {
  const { $config } = useContext();
  const { activeCurrency } = useLocale();

  const formatter = currencyFormatter(activeCurrency.value);
  const currencyCode =
    activeCurrency.value?.code ?? $config.theme?.fallbackCurrency;

  const enhancedPrice: AgnosticPrice = {
    regular:
      product.attributes.price[currencyCode]?.amount !== undefined
        ? formatter.format(product.attributes.price[currencyCode]?.amount / 100)
        : (undefined as any)
  };

  if (product.meta.original_price) {
    enhancedPrice.regular = formatter.format(
      product.meta.original_price[currencyCode].amount / 100
    ) as any;
    enhancedPrice.special = formatter.format(
      product.attributes.price[currencyCode]?.amount / 100
    ) as any;
  }

  return enhancedPrice;
};

export default enhanceProductPrice;

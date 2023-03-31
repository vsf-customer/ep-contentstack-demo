import { AgnosticMediaGalleryItem, AgnosticPrice } from '@vue-storefront/core';
import type { Product } from '@vsf-enterprise/epcc-api';
import { useContext } from '@nuxtjs/composition-api';
import { useCart, useLocale, useImageProvider } from '@/composables';
import { currencyFormatter, enhanceProductPrice } from '@/helpers';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useProductData = () => {
  const { $config } = useContext();
  const { getImageUrl } = useImageProvider();
  const { cart } = useCart();
  const { activeCurrency } = useLocale();

  const getName = (product: Product): string => {
    return product?.attributes?.name ?? "Product's name";
  };

  const getSlug = (product: Product): string => {
    return product?.attributes?.slug ?? '';
  };

  const getPrice = (product: Product): AgnosticPrice => {
    return product?.attributes?.price
      ? enhanceProductPrice(product)
      : {
        regular: 0,
        special: 0
      };
  };

  const getTiers = (
    product: Product
  ): Array<{
    // eslint-disable-next-line camelcase
    minimum_quantity: number;
    price: AgnosticPrice;
  }> => {
    const formatter = currencyFormatter(activeCurrency.value);
    const currencyCode =
      activeCurrency.value?.code ?? $config.theme?.fallbackCurrency;

    return product?.attributes?.tiers
      ? Object.keys(product.attributes.tiers).reduce(
        (all, tierName) => [
          ...all,
          {
            minimum_quantity:
                product.attributes.tiers[tierName].minimum_quantity,
            price: {
              regular: product.attributes.tiers[tierName].price[currencyCode]
                ? formatter.format(
                  product.attributes.tiers[tierName].price[currencyCode]
                    .amount / 100
                )
                : undefined
            }
          }
        ],
        []
      )
      : [];
  };

  const getGallery = (product: Product): AgnosticMediaGalleryItem[] => {
    return (
      product?.files?.map((image) => {
        const url = image.link.href;
        const link = getImageUrl(url);

        return {
          small: link,
          normal: link,
          big: link
        };
      }) ??
      $config.theme.product.placeholderImage.map((placeholder) => ({
        small: placeholder.url,
        normal: placeholder.url,
        big: placeholder.url
      }))
    );
  };

  const getCoverImage = (product: Product): string => {
    const url =
      product?.main_image?.link.href ?? product?.files?.[0]?.link.href ?? '';
    return getImageUrl(url);
  };

  const getDescription = (product: Product): string => {
    return product?.attributes?.description || '';
  };

  const getCategoryIds = (product: Product): string[] => {
    return (
      product?.relationships?.categories.map((category) => category.id) ?? []
    );
  };

  const getId = (product: Product): string => {
    return product?.id ?? '';
  };

  const getAttribute = (product: Product, attributeName: string) => {
    return product?.attributes?.extensions?.['products(extension)'] &&
      attributeName
      ? product.attributes.extensions['products(extension)'][attributeName] ??
          ''
      : '';
  };

  const getExtensionAttributes = (product: Product) => {
    return Object.keys(
      product?.attributes?.extensions?.['products(extension)'] ?? {}
    );
  };

  const getOptions = (product: Product, filterByOptionName?: string[]) => {
    const lowerCaseFilterByOptionName =
      filterByOptionName?.map((optionName) => optionName.toLowerCase()) ?? [];
    return (
      product?.meta?.variations?.reduce((all, variation) => {
        const shouldInclude = lowerCaseFilterByOptionName?.length
          ? lowerCaseFilterByOptionName.includes(variation.name.toLowerCase())
          : true;
        if (shouldInclude) {
          all[variation.name.toLowerCase()] = variation.options.map(
            (option) => ({
              ...option,
              value: option.name,
              label: option.description
            })
          );
        }

        return Object.keys(all)
          .sort()
          .reduce((obj, key) => {
            obj[key] = all[key];
            return obj;
          }, {});
      }, {}) || {}
    );
  };

  const getActiveVariantId = (
    product: Product,
    configuration: Record<string, unknown>
  ) => {
    if (!product || !configuration) {
      return undefined;
    }

    const options = getOptions(product);
    const variantIdList = Object.keys(configuration).map(
      (variationName) =>
        options[variationName].find(
          (option) => option.value === configuration[variationName]
        ).id
    );
    const variationMatrix = product?.meta?.variation_matrix ?? {};

    const findVariantProductId = (variationData) => {
      if (typeof variationData === 'string') {
        return variationData;
      }

      for (const variationId in variationData) {
        if (variantIdList.includes(variationId)) {
          return findVariantProductId(variationData[variationId]);
        }
      }
    };

    return findVariantProductId(variationMatrix);
  };

  const hasStock = (product: Product, quantity = 1) => {
    const limit = $config.theme.product?.outOfStockThreshold ?? 0;
    const cartItemQuantity =
      cart.value?.items?.find((item) => item.product_id === product?.id)
        ?.quantity ?? 0;

    return (
      (!product?.inventory ||
        product?.inventory?.available === null ||
        product?.inventory?.available - cartItemQuantity >= limit + quantity) &&
      (!product?.component_products?.length ||
        product?.component_products.every(
          (componentProduct) => {
            return !componentProduct.inventory ||
              componentProduct.inventory?.available === null ||
              componentProduct.inventory.available - cartItemQuantity >= limit + quantity;
          }
        ))
    );
  };

  const isLowOnStock = (product: Product) => {
    const outOfStockLimit = $config.theme.product?.outOfStockThreshold ?? 0;
    const lowWarningLimit = $config.theme.product?.lowStockThreshold ?? 10;
    const cartItemQuantity =
      cart.value?.items?.find((item) => item.product_id === product?.id)
        ?.quantity ?? 0;

    return (
      (product?.inventory?.available <= lowWarningLimit &&
        product?.inventory?.available - cartItemQuantity > outOfStockLimit) ||
      Boolean(
        product?.component_products?.some(
          (componentProduct) =>
            componentProduct.inventory?.available <= lowWarningLimit &&
            componentProduct.inventory?.available - cartItemQuantity >
              outOfStockLimit
        )
      )
    );
  };

  return {
    getName,
    getSlug,
    getPrice,
    getTiers,
    getGallery,
    getCoverImage,
    getDescription,
    getCategoryIds,
    getId,
    getAttribute,
    getExtensionAttributes,
    getOptions,
    getActiveVariantId,
    hasStock,
    isLowOnStock
  };
};

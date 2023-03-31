import { AgnosticPrice, AgnosticTotals } from '@vue-storefront/core';
import type {
  FormattedPrice,
  FormattedTotalPrice,
  Product,
  Wishlist,
  WishlistItem
} from '@vsf-enterprise/epcc-api';
import { useCartData, useLocale, useImageProvider } from '@/composables';
import { currencyFormatter } from '@/helpers';
import { useContext } from '@nuxtjs/composition-api';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useWishlistData = () => {
  const {
    $config: {
      theme: { wishlistPrefix }
    }
  } = useContext();
  const { activeCurrency, currencies } = useLocale();
  const { getImageUrl } = useImageProvider();

  function getItems(wishlist: Wishlist): WishlistItem[] {
    return wishlist;
  }

  function getLineItemByProductId(
    wishlist: Wishlist,
    product: Product
  ): WishlistItem | undefined {
    return wishlist.find((item) => item.sku === `${wishlistPrefix}${product.id}`);
  }

  function getTotals(wishlist: Wishlist): AgnosticTotals {
    const { getItemPrice } = useCartData();
    const total = wishlist.reduce((price, wishlistCartItem) => {
      const productPrice = getItemPrice(wishlistCartItem);
      return price + (productPrice.special || productPrice.regular);
    }, 0);
    return {
      total,
      subtotal: total
    };
  }

  function getItemName(item: WishlistItem): string {
    return item?.name ?? '';
  }

  function getItemImage(item: WishlistItem, fullURL = false): string {
    const url = item?.image?.href ?? '';
    return getImageUrl(url, fullURL);
  }

  /* TODO: Revisit this with a product with a sale price */
  function getItemPrice(item: WishlistItem): AgnosticPrice {
    const { getItemPrice: getCartItemPrice } = useCartData();
    return getCartItemPrice(item);
  }

  function getItemPriceFormatted(
    item: WishlistItem,
    isUnit?: boolean
  ): FormattedPrice {
    const { getItemPriceFormatted: getCartItemPriceFormatted } = useCartData();
    return getCartItemPriceFormatted(item, isUnit);
  }

  function getItemSku(item: WishlistItem): string {
    return item?.sku ?? 'product-sku';
  }

  function getTotalItems(wishlist: Wishlist): number {
    return (wishlist ?? []).length;
  }

  function getTotalsFormatted(wishlist: Wishlist): FormattedTotalPrice {
    const cartCurrencyCode = wishlist[0]?.value.currency;
    const cartCurrency = cartCurrencyCode
      ? currencies.value.find((currency) => currency.code === cartCurrencyCode)
      : activeCurrency.value;

    const formatter = currencyFormatter(cartCurrency);
    const totals = getTotals(wishlist);

    return {
      total: formatter.format(totals.total / 100),
      subtotal: formatter.format(totals.subtotal / 100)
    };
  }

  return {
    getItems,
    getLineItemByProductId,
    getTotals,
    getItemName,
    getItemImage,
    getItemPrice,
    getItemSku,
    getTotalItems,
    getItemPriceFormatted,
    getTotalsFormatted
  };
};

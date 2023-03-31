import { currencyFormatter } from '@/helpers';
import type { UseCartData } from '@/composables/useCartData/types';
import type {
  Cart,
  CartItem,
  FormattedPrice,
  FormattedTotalPrice
} from '@vsf-enterprise/epcc-api';
import type {
  AgnosticPrice,
  AgnosticTotals,
  AgnosticCoupon,
  AgnosticDiscount
} from '@vue-storefront/core';
import { useLocale, useImageProvider } from '@/composables';

export function useCartData(): UseCartData {
  const { activeCurrency, currencies } = useLocale();
  const { getImageUrl } = useImageProvider();

  function getItems(cart: Cart): CartItem[] {
    return cart?.items ?? [];
  }

  function getItemName(item: CartItem): string {
    return item?.name ?? '';
  }

  function getItemImage(item: CartItem, fullURL = false): string {
    const url = item?.image?.href ?? '';
    return getImageUrl(url, fullURL);
  }

  function getItemPrice(item: CartItem): AgnosticPrice {
    const discounts =
      item?.discounts?.reduce(
        (all, discount) => all + discount.amount.amount,
        0
      ) ?? 0;

    // Note that discount values are negative, so the end discount will also be negative
    return {
      regular: item?.value?.amount,
      ...(item?.discounts?.length
        ? {
          special:
              Math.abs(discounts) > item.value.amount
                ? 0
                : item.value.amount + discounts
        }
        : {})
    };
  }

  function getItemUnitPrice(item: CartItem): AgnosticPrice {
    return {
      regular: item?.unit_price?.amount
    };
  }

  function getItemPriceFormatted(
    item: CartItem,
    isUnit?: boolean
  ): FormattedPrice {
    const formatter = currencyFormatter(
      currencies.value.find((currency) => currency.code === item.value.currency)
    );

    const itemPrice = isUnit ? getItemUnitPrice(item) : getItemPrice(item);

    return {
      regular: formatter.format(itemPrice.regular / 100),
      ...(itemPrice.special !== undefined
        ? {
          special: formatter.format(itemPrice.special / 100)
        }
        : {})
    };
  }

  function getItemQty(item: CartItem): number {
    return item.quantity;
  }

  function getBundleComponents(
    item: CartItem
  ): Array<Pick<CartItem, 'id' | 'quantity' | 'name'>> {
    return Object.keys(item?.components || {}).map((key) => ({
      id: item.components[key].options[0].id,
      name: item.components[key].options[0]?.attributes?.name || '',
      quantity: item.components[key].options[0].quantity
    }));
  }

  function getItemSku(item: CartItem): string {
    return item.sku;
  }

  function getTax(cart: Cart): number {
    return cart?.meta?.display_price?.tax?.amount ?? 0;
  }

  function getTotals(cart: Cart): AgnosticTotals {
    return {
      total: cart?.meta?.display_price?.with_tax?.amount ?? 0,
      subtotal: cart?.meta?.display_price?.without_tax?.amount ?? 0
    };
  }

  function getTotalItems(cart: Cart): number {
    if (cart?.items) {
      return cart.items
        .filter((item) => item.type === 'cart_item')
        .reduce(
          (numberOfItems, product) => numberOfItems + product.quantity,
          0
        );
    } else {
      return 0;
    }
  }

  function getTotalsFormatted(cart: Cart): FormattedTotalPrice {
    const cartCurrencyCode = cart.items?.[0]?.value.currency;
    const cartCurrency = cartCurrencyCode
      ? currencies.value.find((currency) => currency.code === cartCurrencyCode)
      : activeCurrency.value;

    const formatter = currencyFormatter(cartCurrency);
    const totals = getTotals(cart);

    return {
      total: formatter.format(totals.total / 100),
      subtotal: formatter.format(totals.subtotal / 100)
    };
  }

  function getFormattedPrice(price: number, currency?: string): string {
    return currencyFormatter(
      currency
        ? currencies.value.find(
          (availableCurrency) => availableCurrency.code === currency
        )
        : activeCurrency.value
    ).format(price);
  }

  function getValueFormatted(value: number, cart: Cart): string {
    const cartCurrencyCode = cart.items?.[0]?.value.currency;
    const cartCurrency = cartCurrencyCode
      ? currencies.value.find((currency) => currency.code === cartCurrencyCode)
      : activeCurrency.value;

    return currencyFormatter(cartCurrency).format(value / 100);
  }

  function getCoupons(cart: Cart): AgnosticCoupon[] {
    const coupons = (cart?.items || []).filter(
      (item) => item.type === 'promotion_item'
    );

    return coupons.map((coupon) => ({
      id: coupon.id,
      name: coupon.name,
      value: coupon.value?.amount || 0,
      code: coupon.sku
    }));
  }

  function getSubtotalWithoutDiscounts(cart: Cart): number {
    return (cart?.items || [])
      .filter((item) => item.type === 'cart_item')
      .reduce((total, item) => {
        const itemPrice = getItemPrice(item);

        return total + itemPrice.regular;
      }, 0);
  }

  function getDiscounts(cart: Cart): AgnosticDiscount[] {
    return [
      ...getCoupons(cart).map((coupon) => ({
        id: coupon.id,
        name: coupon.name,
        description: coupon.name,
        value: coupon.value
      })),
      ...(cart?.items
        ? cart.items.reduce((allDiscounts, item) => {
          if (item?.discounts?.length) {
            return [
              ...allDiscounts,
              ...item.discounts.map((discount) => ({
                id: discount.code,
                name: discount.code,
                description: `Item discount for ${item.name} (${item.sku})`,
                value: discount.amount.amount
              }))
            ];
          }

          return allDiscounts;
        }, [])
        : [])
    ];
  }

  return {
    getTax,
    getItems,
    getTotals,
    getItemQty,
    getCoupons,
    getItemSku,
    getItemName,
    getDiscounts,
    getItemImage,
    getItemPrice,
    getTotalItems,
    getItemUnitPrice,
    getValueFormatted,
    getFormattedPrice,
    getTotalsFormatted,
    getBundleComponents,
    getItemPriceFormatted,
    getSubtotalWithoutDiscounts
  };
}

export * from './types';

import type {
  Cart,
  CartItem,
  FormattedPrice,
  FormattedTotalPrice
} from '@vsf-enterprise/epcc-api';
import type {
  AgnosticPrice,
  AgnosticCoupon,
  AgnosticTotals,
  AgnosticDiscount
} from '@vue-storefront/core';

export interface UseCartData {
  getTax(cart: Cart): number;
  getItems(cart: Cart): CartItem[];
  getTotalItems(cart: Cart): number;
  getItemQty(item: CartItem): number;
  getItemSku(item: CartItem): string;
  getItemName(item: CartItem): string;
  getItemImage(item: CartItem): string;
  getTotals(cart: Cart): AgnosticTotals;
  getCoupons(cart: Cart): AgnosticCoupon[];
  getValueFormatted(value: number, cart: Cart): string;
  getFormattedPrice(price: number, currency?: string): string;
  getItemPrice(item: CartItem): AgnosticPrice;
  getDiscounts(cart: Cart): AgnosticDiscount[];
  getSubtotalWithoutDiscounts(cart: Cart): number;
  getItemUnitPrice(item: CartItem): AgnosticPrice;
  getTotalsFormatted(cart: Cart): FormattedTotalPrice;
  getItemPriceFormatted(item: CartItem, isUnit?: boolean): FormattedPrice;
  getBundleComponents(
    item: CartItem
  ): Array<Pick<CartItem, 'id' | 'quantity' | 'name'>>;
}

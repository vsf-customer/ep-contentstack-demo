import type {
  Order,
  OrderItem,
  OrdersResponse
} from '@vsf-enterprise/epcc-api';
import { useLocale } from '@/composables';
import { currencyFormatter } from '@/helpers';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useOrderData = () => {
  const { currencies } = useLocale();

  const getDate = (order: Order): string =>
    order?.meta?.timestamps?.created_at
      ? new Date(order.meta.timestamps.created_at).toLocaleDateString()
      : '';

  const getId = (order: Order): string => order?.id ?? '';

  const getStatus = (order: Order): string => order?.status || 'Failed';

  const getPriceFormatted = (order: Order): string => {
    return order?.meta?.display_price?.with_tax?.formatted ?? '';
  };

  const getOrderTax = (order: Order & { items?: OrderItem[] }): number =>
    order?.meta?.display_price?.tax?.amount ??
    (order?.items || []).reduce(
      (total, item) =>
        total + item?.meta?.display_price?.tax?.value?.amount ?? 0,
      0
    );

  const getOrdersTotal = (orders: OrdersResponse): number => {
    return orders?.meta?.results?.total ?? 0;
  };

  const getOrderDiscountFormatted = (order: Order): string => {
    const orderDiscount = order?.meta?.display_price?.discount?.amount;
    return orderDiscount ? order?.meta?.display_price?.discount?.formatted : '';
  };

  const getOrderTotalsFormatted = (order: Order): string => {
    return order?.meta?.display_price.with_tax.formatted ?? '';
  };

  const getItems = (
    currentOrder: Order,
    orders: OrdersResponse
  ): OrderItem[] => {
    if (
      !orders?.included?.items.length ||
      !currentOrder?.relationships?.items?.data
    ) {
      return [];
    }

    return currentOrder.relationships.items.data.reduce<OrderItem[]>(
      (products, currentItem) => {
        const product = orders.included.items.find(
          (orderItem) => orderItem.id === currentItem.id
        );

        if (product && product.value.amount >= 0) {
          products.push(product);
        }

        return products;
      },
      []
    );
  };

  const getItemProductId = (item: OrderItem): string => item?.product_id ?? '';

  const getItemSku = (item: OrderItem): string => item?.sku ?? '';

  const getItemName = (item: OrderItem): string => item?.name ?? '';

  const getItemQty = (item: OrderItem): number => item?.quantity ?? 0;

  const getItemPriceFormatted = (item: OrderItem): string => {
    const formatter = currencyFormatter(
      currencies.value.find((currency) => currency.code === item.value.currency)
    );

    if (item?.value?.amount === undefined || item?.value?.amount === null) {
      return '';
    } else {
      return formatter.format(item?.value?.amount / 100);
    }
  };

  const getItemUnitPriceFormatted = (item: OrderItem): string => {
    const formatter = currencyFormatter(
      currencies.value.find((currency) => currency.code === item.value.currency)
    );

    if (
      item?.unit_price?.amount === undefined ||
      item?.unit_price?.amount === null
    ) {
      return '';
    } else {
      return formatter.format(item?.unit_price?.amount / 100);
    }
  };

  const getShippingAddress = (order: Order) =>
    order?.shipping_address ?? {
      first_name: '',
      last_name: '',
      line_1: '',
      line2: '',
      city: '',
      postcode: '',
      county: '',
      country: '',
      phone_number: '',
      instructions: '',
      company_name: ''
    };

  const getBillingAddress = (order: Order) =>
    order?.billing_address ?? {
      first_name: '',
      last_name: '',
      line_1: '',
      line2: '',
      city: '',
      postcode: '',
      country: '',
      county: '',
      company_name: ''
    };

  const getCustomer = (order: Order) => {
    return {
      name: order?.customer?.name ?? '',
      email: order?.customer?.email ?? ''
    };
  };

  function getValueFormatted(value: number, order: Order): string {
    const orderCurrency = order?.meta.display_price.with_tax.currency;
    const formatter = currencyFormatter(
      currencies.value.find((currency) => currency.code === orderCurrency)
    );

    return formatter.format(value / 100);
  }

  return {
    getDate,
    getCustomer,
    getId,
    getStatus,
    getPriceFormatted,
    getItems,
    getItemProductId,
    getItemSku,
    getItemName,
    getItemQty,
    getItemPriceFormatted,
    getItemUnitPriceFormatted,
    getOrdersTotal,
    getOrderTotalsFormatted,
    getOrderDiscountFormatted,
    getShippingAddress,
    getBillingAddress,
    getOrderTax,
    getValueFormatted
  };
};

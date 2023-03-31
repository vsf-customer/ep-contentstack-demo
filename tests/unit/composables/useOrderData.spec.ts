import { useOrderData } from '../../../composables/useOrderData';
import { orderItemsMock, orderMock } from '../../__mocks__/order.mock';
import { expect } from '@jest/globals';
import { currencyFormatter } from '../../../helpers/currency-formatter';
import { setActivePinia } from 'pinia';
import { createTestingPinia } from '@pinia/testing';
import { themeConfigMock } from '@/tests/__mocks__/themeConfig.mock';

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

describe('[epcc-theme] useOrderData', () => {
  const orderData = useOrderData();
  const orderItem = orderItemsMock[0];
  const orderShippingAddress = {
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
  const orderBillingAddress = {
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

  describe('getDate', () => {
    it('should return the formatted creation date of the order', () => {
      expect(orderData.getDate(orderMock)).toEqual(
        new Date(orderMock.meta.timestamps.created_at).toLocaleDateString()
      );
    });

    it('should return empty string when order is not defined', () => {
      expect(orderData.getDate(undefined)).toEqual('');
    });
  });

  describe('getId', () => {
    it('should return the id of the order', () => {
      expect(orderData.getId(orderMock)).toEqual(orderMock.id.toString());
    });

    it('should return empty string when order is not defined', () => {
      expect(orderData.getId(undefined)).toEqual('');
    });
  });

  describe('getStatus', () => {
    it('should return the status of the order', () => {
      expect(orderData.getStatus(orderMock)).toEqual(orderMock.status);
    });

    it('should return Failed when order is not defined', () => {
      expect(orderData.getStatus(undefined)).toEqual('Failed');
    });
  });

  describe('getPriceFormatted', () => {
    it('should return the total price', async () => {
      expect(orderData.getPriceFormatted(orderMock)).toEqual(
        orderMock.meta.display_price.with_tax.formatted
      );
    });

    it('should return empty string when order is not defined', () => {
      expect(orderData.getPriceFormatted(undefined)).toEqual('');
    });
  });

  describe('getOrderDiscountFormatted', () => {
    it('should return the discount price formatted', async () => {
      expect(orderData.getOrderDiscountFormatted(orderMock)).toEqual(
        orderMock.meta.display_price.discount.formatted
      );
    });

    it('should return empty string when order discount is not defined', () => {
      expect(orderData.getOrderDiscountFormatted(undefined)).toEqual('');
    });
  });

  describe('getOrdersTotal', () => {
    it('should return the number of the orders in a list', () => {
      const expectedValue = 4;

      expect(
        orderData.getOrdersTotal({
          meta: {
            results: {
              total: expectedValue
            }
          }
        } as any)
      ).toEqual(expectedValue);
    });

    it('should return 0 when no input given', () => {
      expect(orderData.getOrdersTotal(undefined)).toEqual(0);
    });
  });

  describe('getItems', () => {
    it('should collect the items for the given order', () => {
      const orderResponse = {
        included: {
          items: orderItemsMock
        }
      };

      expect(orderData.getItems(orderMock, orderResponse as any)).toEqual(
        orderItemsMock.filter((item) => item.value.amount >= 0)
      );
    });

    it('should return empty array when any of the parameters are not defined', () => {
      const orderResponse = {
        included: {
          items: orderItemsMock
        }
      };

      expect(orderData.getItems(undefined, undefined)).toEqual([]);
      expect(orderData.getItems(orderMock, undefined)).toEqual([]);
      expect(orderData.getItems(undefined, orderResponse as any)).toEqual([]);
    });
  });

  describe('getItemProductId', () => {
    it('should return the corresponding product id for the order item', () => {
      expect(orderData.getItemProductId(orderItem)).toEqual(
        orderItem.product_id
      );
    });

    it('should return empty string when the item is not defined', () => {
      expect(orderData.getItemProductId(undefined)).toEqual('');
    });
  });

  describe('getItemProductId', () => {
    it('should return the sku of the order item', () => {
      expect(orderData.getItemSku(orderItem)).toEqual(orderItem.sku);
    });

    it('should return empty string when the item is not defined', () => {
      expect(orderData.getItemSku(undefined)).toEqual('');
    });
  });

  describe('getItemName', () => {
    it('should return the name of the order item', () => {
      expect(orderData.getItemName(orderItem)).toEqual(orderItem.name);
    });

    it('should return empty string when the item is not defined', () => {
      expect(orderData.getItemName(undefined)).toEqual('');
    });
  });

  describe('getItemQty', () => {
    it('should return the quantity of the order item', () => {
      expect(orderData.getItemQty(orderItem)).toEqual(orderItem.quantity);
    });

    it('should return 0 when the item is not defined', () => {
      expect(orderData.getItemQty(undefined)).toEqual(0);
    });
  });

  describe('getItemPriceFormatted', () => {
    it('should return the price of the order item', () => {
      const formattedPrice = currencyFormatter().format(
        orderItem.value.amount / 100
      );
      expect(orderData.getItemPriceFormatted(orderItem)).toEqual(
        formattedPrice
      );
    });

    it('should return empty string when the item is not defined', () => {
      expect(orderData.getItemPriceFormatted(undefined)).toEqual('');
    });
  });

  describe('getItemUnitPriceFormatted', () => {
    const formattedPrice = currencyFormatter().format(
      orderItem?.unit_price?.amount / 100
    );
    it('should return the unit price of the order item', () => {
      expect(orderData.getItemUnitPriceFormatted(orderItem)).toEqual(
        formattedPrice
      );
    });

    it('should return empty string when the item is not defined', () => {
      expect(orderData.getItemUnitPriceFormatted(undefined)).toEqual('');
    });
  });

  describe('getShippingAddress', () => {
    it('should return the shipping address of the order', () => {
      expect(orderData.getShippingAddress(orderMock)).toEqual(
        orderMock?.shipping_address
      );
    });

    it('should return a order shipping address object with empty values when the item is not defined', () => {
      expect(orderData.getShippingAddress(undefined)).toEqual(
        orderShippingAddress
      );
    });
  });

  describe('getBillingAddress', () => {
    it('should return the shipping address of the order', () => {
      expect(orderData.getBillingAddress(orderMock)).toEqual(
        orderMock?.billing_address
      );
    });

    it('should return a order shipping address object with empty values when the item is not defined', () => {
      expect(orderData.getBillingAddress(undefined)).toEqual(
        orderBillingAddress
      );
    });
  });

  describe('getCustomer', () => {
    it('should return the customers name and email from the order', () => {
      expect(orderData.getCustomer(orderMock)).toEqual({
        name: orderMock?.customer.name,
        email: orderMock?.customer.email
      });
    });

    it('should return a customer object with empty values when the item is not defined', () => {
      expect(orderData.getCustomer(undefined)).toEqual({
        name: '',
        email: ''
      });
    });
  });
});

import faker from '@faker-js/faker';
import { expect } from '@jest/globals';
import { setActivePinia } from 'pinia';
import { useCheckout } from '@/composables';
import { createTestingPinia } from '@pinia/testing';
import { COOKIE_KEY_CHECKOUT_DATA } from '@/constants';
import type { ContextualizedEndpoints } from '@vsf-enterprise/epcc-api';
import type { CheckoutData, UseCheckoutData } from '@/composables/useCheckout';

const defaultState: UseCheckoutData = {
  customer: {},
  payment_method: {},
  shipping_method: {},
  billing_address: {},
  shipping_address: {}
};

const ctx = {
  $vsf: {
    $epcc: {
      api: {} as Partial<ContextualizedEndpoints>
    }
  },
  $cookies: {
    get: null,
    set: null,
    remove: null
  }
};

jest.mock('@nuxtjs/composition-api', () => ({
  ...jest.requireActual('@nuxtjs/composition-api'),
  useContext: () => ctx
}));

describe('[epcc-theme] useCheckout', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  describe('setCustomer', () => {
    it('should set customer', () => {
      // arrange
      setActivePinia(createTestingPinia());
      ctx.$cookies.set = jest.fn(() => undefined);
      ctx.$cookies.get = jest.fn(() => undefined);

      const id = faker.datatype.uuid();
      const { data, setCustomer } = useCheckout();

      // act
      setCustomer({ id });

      // assert
      expect(data).toEqual({
        ...defaultState,
        customer: { id }
      });
      expect(ctx.$cookies.set).toHaveBeenCalledTimes(1);
      expect(ctx.$cookies.set).toHaveBeenCalledWith(COOKIE_KEY_CHECKOUT_DATA, {
        ...defaultState,
        customer: { id }
      });
      expect(ctx.$cookies.get).toHaveBeenCalledTimes(1);
      expect(ctx.$cookies.get).toHaveBeenCalledWith(COOKIE_KEY_CHECKOUT_DATA);
    });
  });

  describe('setShippingAddress', () => {
    it('should set shipping address', () => {
      // arrange
      setActivePinia(createTestingPinia());
      ctx.$cookies.get = jest.fn(() => undefined);
      ctx.$cookies.set = jest.fn(() => undefined);

      const address: CheckoutData['shipping_address'] = {
        billing: true,
        instructions: '',
        default_address: true,
        type: 'customer-address',
        id: faker.datatype.uuid(),
        city: faker.address.city(),
        name: faker.name.findName(),
        county: faker.address.county(),
        country: faker.address.country(),
        last_name: faker.name.lastName(),
        postcode: faker.address.zipCode(),
        first_name: faker.name.firstName(),
        line_1: faker.address.streetAddress(),
        phone_number: faker.phone.phoneNumber(),
        line_2: faker.address.secondaryAddress(),
        company_name: faker.company.companyName()
      };

      const { data, setShippingAddress } = useCheckout();

      // act
      setShippingAddress(address);

      // assert
      expect(data).toEqual({
        ...defaultState,
        shipping_address: address
      });
      expect(ctx.$cookies.set).toHaveBeenCalledTimes(1);
      expect(ctx.$cookies.set).toHaveBeenCalledWith(COOKIE_KEY_CHECKOUT_DATA, {
        ...defaultState,
        shipping_address: address
      });
      expect(ctx.$cookies.get).toHaveBeenCalledTimes(1);
      expect(ctx.$cookies.get).toHaveBeenCalledWith(COOKIE_KEY_CHECKOUT_DATA);
    });
  });

  describe('setBillingAddress', () => {
    it('should set billing address', () => {
      // arrange
      setActivePinia(createTestingPinia());
      ctx.$cookies.get = jest.fn(() => undefined);
      ctx.$cookies.set = jest.fn(() => undefined);

      const address: CheckoutData['billing_address'] = {
        instructions: '',
        default_address: true,
        type: 'customer-address',
        id: faker.datatype.uuid(),
        city: faker.address.city(),
        name: faker.name.findName(),
        county: faker.address.county(),
        country: faker.address.country(),
        last_name: faker.name.lastName(),
        postcode: faker.address.zipCode(),
        first_name: faker.name.firstName(),
        line_1: faker.address.streetAddress(),
        phone_number: faker.phone.phoneNumber(),
        line_2: faker.address.secondaryAddress(),
        company_name: faker.company.companyName()
      };

      const { data, setBillingAddress } = useCheckout();

      // act
      setBillingAddress(address);

      // assert
      expect(data).toEqual({
        ...defaultState,
        billing_address: address
      });
      expect(ctx.$cookies.set).toHaveBeenCalledTimes(1);
      expect(ctx.$cookies.set).toHaveBeenCalledWith(COOKIE_KEY_CHECKOUT_DATA, {
        ...defaultState,
        billing_address: address
      });
      expect(ctx.$cookies.get).toHaveBeenCalledTimes(1);
      expect(ctx.$cookies.get).toHaveBeenCalledWith(COOKIE_KEY_CHECKOUT_DATA);
    });
  });

  describe('setShippingMethod', () => {
    it('should set shipping method', () => {
      // arrange
      setActivePinia(createTestingPinia());
      ctx.$cookies.get = jest.fn(() => undefined);
      ctx.$cookies.set = jest.fn(() => undefined);

      const method = {
        type: 'entry',
        value: 'standard',
        id: faker.datatype.uuid(),
        label: faker.lorem.sentence(),
        price: Number(faker.commerce.price()),
        description: faker.lorem.sentence()
      } as CheckoutData['shipping_method'];

      const { data, setShippingMethod } = useCheckout();

      // act
      setShippingMethod(method);

      // assert
      expect(data).toEqual({
        ...defaultState,
        shipping_method: method
      });
      expect(ctx.$cookies.set).toHaveBeenCalledTimes(1);
      expect(ctx.$cookies.set).toHaveBeenCalledWith(COOKIE_KEY_CHECKOUT_DATA, {
        ...defaultState,
        shipping_method: method
      });
      expect(ctx.$cookies.get).toHaveBeenCalledTimes(1);
      expect(ctx.$cookies.get).toHaveBeenCalledWith(COOKIE_KEY_CHECKOUT_DATA);
    });
  });

  describe('setPaymentMethod', () => {
    it('should set payment method', () => {
      // arrange
      setActivePinia(createTestingPinia());
      ctx.$cookies.get = jest.fn(() => undefined);
      ctx.$cookies.set = jest.fn(() => undefined);

      const method = {
        value: 'manual',
        label: 'Cash on delivery'
      } as CheckoutData['payment_method'];

      const { data, setPaymentMethod } = useCheckout();

      // act
      setPaymentMethod(method);

      // assert
      expect(data).toEqual({
        ...defaultState,
        payment_method: method
      });
      expect(ctx.$cookies.set).toHaveBeenCalledTimes(1);
      expect(ctx.$cookies.set).toHaveBeenCalledWith(COOKIE_KEY_CHECKOUT_DATA, {
        ...defaultState,
        payment_method: method
      });
      expect(ctx.$cookies.get).toHaveBeenCalledTimes(1);
      expect(ctx.$cookies.get).toHaveBeenCalledWith(COOKIE_KEY_CHECKOUT_DATA);
    });
  });

  describe('clear', () => {
    it('should clear data', () => {
      // arrange
      setActivePinia(
        createTestingPinia({
          initialState: {
            'checkout-store': {
              data: {
                ...defaultState,
                customer: {
                  id: faker.datatype.uuid()
                }
              }
            }
          }
        })
      );

      ctx.$cookies.get = jest.fn(() => undefined);
      ctx.$cookies.set = jest.fn(() => undefined);
      ctx.$cookies.remove = jest.fn(() => undefined);

      const { data, clear } = useCheckout();

      // act
      clear();

      // assert
      expect(data).toEqual(defaultState);
    });
  });
});

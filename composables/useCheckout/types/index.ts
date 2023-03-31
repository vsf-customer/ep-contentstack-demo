import type { DeepReadonly } from '@nuxtjs/composition-api';
import type { CheckoutData as ElasticPathCheckoutData } from '@vsf-enterprise/epcc-api';

export type CheckoutData = ElasticPathCheckoutData & {
  payment_method: {
    label: string;
    value: 'manual' | string;
  };
  shipping_method: {
    id: string;
    type: string;
    label: string;
    price: number;
    description: string;
    value: 'standard' | 'next-day' | string;
    links: {
      self: string;
    };
    meta: {
      timestamps: {
        created_at: string;
        updated_at: string;
      };
    };
  };
};

export type UseCheckoutData = {
  customer: Record<string, never> | CheckoutData['customer'];
  payment_method: Record<string, never> | CheckoutData['payment_method'];
  billing_address: Record<string, never> | CheckoutData['billing_address'];
  shipping_method: Record<string, never> | CheckoutData['shipping_method'];
  shipping_address: Record<string, never> | CheckoutData['shipping_address'];
};

export type UseCheckoutClear = () => void;
export type UseCheckoutSetShippingMethod = (
  params: CheckoutData['shipping_method']
) => void;
export type UseCheckoutSetBillingAddress = (
  params: CheckoutData['billing_address'],
  options?: {
    override?: boolean;
  }
) => void;
export type UseCheckoutSetShippingAddress = (
  params: CheckoutData['shipping_address']
) => void;
export type UseCheckoutSetCustomer = (params: CheckoutData['customer']) => void;
export type UseCheckoutPaymentMethod = (
  params: CheckoutData['payment_method']
) => void;

export interface UseCheckout {
  clear: UseCheckoutClear;
  data: DeepReadonly<UseCheckoutData>;
  setCustomer: UseCheckoutSetCustomer;
  setPaymentMethod: UseCheckoutPaymentMethod;
  setShippingMethod: UseCheckoutSetShippingMethod;
  setBillingAddress: UseCheckoutSetBillingAddress;
  setShippingAddress: UseCheckoutSetShippingAddress;
}

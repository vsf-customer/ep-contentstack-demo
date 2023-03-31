import { ShippingProvider } from '@vsf-enterprise/epcc-api';

export const shippingProviderMock: ShippingProvider = [
  {
    id: '1',
    label: 'Test standard shipping',
    value: 'test-standard',
    description: 'Delivery in 1-2 working days',
    price: 10
  },
  {
    id: '2',
    label: 'Test free shipping',
    value: 'test-free',
    description: 'Delivery in 5-6 working days',
    price: 0
  }
];

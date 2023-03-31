import { Order } from '@vsf-enterprise/epcc-api';
import { StoreDefinition } from 'pinia';

export interface UseMakeOrderErrors {
  make: Error;
}

export interface UseMakeOrderState {
  order: Order | null;
  error: UseMakeOrderErrors;
  loading: boolean;
}

export type UseMakeOrder = StoreDefinition<'order-store', UseMakeOrderState>;

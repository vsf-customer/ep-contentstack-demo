import { defineStore } from 'pinia';
import { UseMakeOrder, UseMakeOrderState } from '@/store/order/types';

export const useOrderStore: UseMakeOrder = defineStore('order-store', {
  state: (): UseMakeOrderState => ({
    order: null,
    loading: false,
    error: { make: null }
  })
});

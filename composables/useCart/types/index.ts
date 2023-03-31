import { ComputedRef } from '@nuxtjs/composition-api';
import { Cart, CartItem, Product } from '@vsf-enterprise/epcc-api';

export interface UseCartAddItemParams {
  quantity: number
  product: Product
}

export interface UseCartIsInCartParams {
  product: Product
}

export interface UseCartUpdateQtyParams {
  quantity: number
  product: CartItem
}

export interface UseCartRemoveItemParams {
  product: CartItem
}

export interface UseCartApplyCouponParams {
  couponCode: string
}

export interface UseCartRemoveCouponParams {
  couponCode: string
}

export interface UseCartErrors {
  load: Error
  clear: Error
  addItem: Error
  removeItem: Error
  applyCoupon: Error
  removeCoupon: Error
  updateItemQty: Error
}

export interface UseCart {
  cart: ComputedRef<Cart>
  loading: ComputedRef<boolean>
  error: ComputedRef<UseCartErrors>
  load(): Promise<Cart>
  clear(): Promise<Cart>
  setCart(newCart: Cart): void
  addItem(params: UseCartAddItemParams): Promise<Cart>
  isInCart(params: UseCartIsInCartParams): boolean
  removeItem(params: UseCartRemoveItemParams): Promise<Cart>
  applyCoupon(params: UseCartApplyCouponParams): Promise<Cart>
  removeCoupon(params: UseCartRemoveCouponParams): Promise<Cart>
  updateItemQty(params: UseCartUpdateQtyParams): Promise<Cart>
}

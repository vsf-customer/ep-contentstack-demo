<template>
  <div id="cart">
    <SfSidebar
      v-e2e="'sidebar-cart'"
      :visible="isCartSidebarOpen"
      :title="$t('My Cart')"
      class="sf-sidebar--right"
      @close="toggleCartSidebar"
    >
      <template #content-top>
        <!-- TODO: This is just an example for cart clearing feature, revisit its styling if it can stay somewhere here -->
        <SfButton @click="clearCart" class="clear-cart" v-if="totalItems">
          {{ $t('Clear cart') }}
        </SfButton>

        <SfProperty
          v-if="totalItems"
          class="sf-property--large cart-summary desktop-only"
          :name="$t('Total items')"
          :value="totalItems"
        />
      </template>
      <transition name="sf-fade" mode="out-in">
        <div v-if="totalItems" key="my-cart" class="my-cart">
          <div class="collected-product-list">
            <transition-group name="sf-fade" tag="div">
              <SfCollectedProduct
                v-for="product in products"
                v-e2e="'collected-product'"
                :key="cartData.getItemSku(product)"
                :image="cartData.getItemImage(product, true)"
                :title="cartData.getItemName(product)"
                :regular-price="
                  cartData.getItemPriceFormatted(product, true).regular
                "
                :special-price="
                  cartData.getItemPriceFormatted(product, true).special
                "
                :stock="99999"
                :image-width="140"
                :image-height="200"
                @click:remove="removeItem({ product })"
                class="collected-product"
                :has-more-actions="false"
              >
                <template #price>
                  <SfPrice
                    v-if="cartData.getItemPriceFormatted(product, true).regular"
                    :regular="
                      cartData.getItemPriceFormatted(product, true).regular
                    "
                    :special="
                      cartData.getItemPriceFormatted(product, true).special
                    "
                  />

                  <div
                    class="bundle-components"
                    v-if="cartData.getBundleComponents(product).length"
                  >
                    <p class="bundle-components__heading">
                      {{ $t('Single quantity contains') }}:
                    </p>
                    <ul class="bundle-components__list">
                      <li
                        v-for="bundleComponent in cartData.getBundleComponents(
                          product
                        )"
                        :key="bundleComponent.id"
                      >
                        {{ bundleComponent.name }} - x ({{
                          bundleComponent.quantity
                        }})
                      </li>
                    </ul>
                  </div>
                </template>
                <template #configuration>
                  <div class="collected-product__properties" />
                </template>
                <template #input>
                  <div class="sf-collected-product__quantity-wrapper">
                    <SfQuantitySelector
                      :disabled="loading"
                      v-if="product.type === 'cart_item'"
                      :qty="cartData.getItemQty(product)"
                      class="sf-collected-product__quantity-selector"
                      @input="
                        handleQuantityChange({ product, quantity: $event })
                      "
                    />
                  </div>
                </template>
                <template #actions>
                  <SfButton
                    v-if="isEnabledWishlist"
                    class="sf-button--text"
                    @click="handleWishlistClick(product)"
                    >{{
                      isInWishlist({ product: { id: product.product_id } })
                        ? $t('Remove from wishlist')
                        : $t('Add to wishlist')
                    }}
                  </SfButton>
                  <span v-else />
                </template>
              </SfCollectedProduct>
            </transition-group>
          </div>
        </div>
        <div v-else key="empty-cart" class="empty-cart">
          <div class="empty-cart__banner">
            <SfImage
              :alt="$t('Empty bag')"
              class="empty-cart__image"
              src="/icons/empty-cart.svg"
              :width="256"
              :height="173"
              image-tag="nuxt-img"
            />
            <SfHeading
              :title="$t('Your cart is empty')"
              :level="2"
              class="empty-cart__heading"
              :description="
                $t(
                  'Looks like you haven’t added any items to the bag yet. Start shopping to fill it in.'
                )
              "
            />
          </div>
        </div>
      </transition>
      <template #content-bottom>
        <transition name="sf-fade">
          <div v-if="totalItems">
            <div class="highlighted discounts" v-if="allDiscounts">
              <SfProperty
                :name="$t('Without discounts')"
                class="sf-property--full-width sf-property--large my-cart__total-price"
              >
                <template #value>
                  <span class="sf-property__value">
                    {{ priceWithoutDiscounts }}
                  </span>
                </template>
              </SfProperty>

              <SfProperty
                :name="$t('All discounts')"
                class="sf-property--full-width sf-property--large my-cart__total-price"
              >
                <template #value>
                  <span class="sf-property__value">
                    {{ cartData.getValueFormatted(allDiscounts, cart) }}
                  </span>
                </template>
              </SfProperty>
            </div>

            <SfProperty
              v-if="cartTax"
              :name="$t('Tax')"
              class="sf-property--full-width sf-property--large my-cart__total-price"
            >
              <template #value>
                <span class="sf-property__value">
                  {{ cartData.getValueFormatted(cartTax, cart) }}
                </span>
              </template>
            </SfProperty>

            <SfProperty
              :name="$t('Subtotal price')"
              class="sf-property--full-width sf-property--large my-cart__total-price"
            >
              <template #value>
                <span class="sf-property__value">
                  {{ totals.total }}
                </span>
              </template>
            </SfProperty>
            <nuxt-link :to="localePath('/checkout')">
              <SfButton
                v-e2e="'go-to-checkout-btn'"
                class="sf-button--full-width color-secondary my-cart__checkout-btn"
                @click="toggleCartSidebar"
              >
                {{ $t('Go to checkout') }}
              </SfButton>
            </nuxt-link>
          </div>
          <div v-else>
            <SfButton
              class="sf-button--full-width color-primary"
              @click="toggleCartSidebar"
              >{{ $t('Go back shopping') }}
            </SfButton>
          </div>
        </transition>

        <template v-if="totalItems">
          <div class="highlighted promo-code cart-coupon" v-if="appliedCoupon">
            <div
              class="sf-property--full-width sf-property--large property sf-property"
            >
              <div>
                <span class="sf-property__name">{{
                  $t('Applied coupon')
                }}</span>
                <span>{{ appliedCoupon.code }}</span>
              </div>
              <div
                class="promo-code__delete cart-coupon__delete"
                @click="removeCouponCode"
                :title="$t('Remove coupon')"
              >
                &times;
              </div>
            </div>
          </div>

          <div class="highlighted promo-code cart-coupon" v-else>
            <SfInput
              v-model="promoCode"
              name="promoCode"
              :placeholder="$t('Enter promo code')"
              class="sf-input--filled promo-code__input cart-coupon__input"
              :error-message="
                couponError ? couponError.detail || couponError.message : ''
              "
              :valid="!Boolean(couponError)"
            />
            <SfButton
              class="promo-code__button"
              data-testid="apply-button"
              @click="applyCouponCode"
            >
              {{ $t('Apply') }}
            </SfButton>
          </div>
        </template>
      </template>
    </SfSidebar>
  </div>
</template>

<script>
import {
  SfSidebar,
  SfHeading,
  SfButton,
  SfIcon,
  SfInput,
  SfProperty,
  SfPrice,
  SfCollectedProduct,
  SfImage,
  SfQuantitySelector
} from '@storefront-ui/vue';
import {
  computed,
  defineComponent,
  ref,
  useContext,
  watch
} from '@nuxtjs/composition-api';
import debounce from 'lodash.debounce';
import {
  useCart,
  useUser,
  useUiState,
  useCartData,
  useWishlist,
  useUiNotification
} from '@/composables';
import { useWishlistData } from '@/composables/useWishlistData';

export default defineComponent({
  name: 'Cart',
  components: {
    SfSidebar,
    SfButton,
    SfHeading,
    SfIcon,
    SfInput,
    SfProperty,
    SfPrice,
    SfCollectedProduct,
    SfImage,
    SfQuantitySelector
  },
  setup() {
    const { $config } = useContext();
    const { isCartSidebarOpen, toggleCartSidebar } = useUiState();
    const cartData = useCartData();
    const wishlistData = useWishlistData();
    const {
      cart,
      removeItem,
      updateItemQty,
      loading,
      clear: clearCart,
      error,
      applyCoupon,
      removeCoupon
    } = useCart();
    const { send } = useUiNotification();
    const {
      wishlist,
      isInWishlist,
      addItem: addItemToWishlist,
      removeItem: removeItemFromWishlist
    } = useWishlist();

    const { wishlistEnabled } = $config.theme;
    const { isAuthenticated } = useUser();

    const isEnabledWishlist = computed(
      () =>
        (isAuthenticated.value && wishlistEnabled.authenticated) ||
        (!isAuthenticated.value && wishlistEnabled.guest)
    );

    const products = computed(() =>
      cartData.getItems(cart.value).filter((item) => item.type === 'cart_item')
    );

    const cartTax = computed(() => cartData.getTax(cart.value));
    const totals = computed(() => cartData.getTotalsFormatted(cart.value));
    const totalItems = computed(() => cartData.getTotalItems(cart.value));
    const priceWithoutDiscounts = computed(() =>
      cartData.getValueFormatted(
        cartData.getSubtotalWithoutDiscounts(cart.value, false),
        cart.value
      )
    );
    const promoCode = ref('');

    const couponError = computed(
      () =>
        error.value.applyCoupon?.response?.data?.errors?.[0] ??
        error.value.applyCoupon
    );
    const appliedCoupon = computed(() => {
      const coupons = cartData.getCoupons(cart?.value);
      return coupons.length ? coupons[0] : null;
    });
    const allDiscounts = computed(() => {
      const discounts = cartData.getDiscounts(cart?.value);
      return discounts.length
        ? discounts.reduce((all, discount) => all + discount.value, 0)
        : null;
    });

    const applyCouponCode = async () => {
      if (promoCode.value) {
        await applyCoupon({ couponCode: promoCode.value });
      }
    };

    const removeCouponCode = async () => {
      if (appliedCoupon.value) {
        await removeCoupon({ couponCode: appliedCoupon.value.code });
        promoCode.value = '';
      }
    };

    const createProductForWishlist = (product) => ({
      product: {
        id: product.product_id,
        files: [
          {
            mime_type: product.image.mime_type,
            link: {
              href: product.image.href
            },
            file_name: product.image.file_name
          }
        ],
        attributes: {
          ...product,
          price: {
            [product.unit_price.currency]: product.unit_price.amount
          }
        }
      }
    });

    const handleQuantityChange = debounce(async ({ product, quantity }) => {
      await updateItemQty({
        product,
        quantity
      });

      if (error.value.updateItemQty) {
        error.value.updateItemQty?.response?.data?.errors?.map((error) =>
          send({ message: error.detail, type: 'danger', id: Symbol() })
        );
      }
    }, 500);

    const handleWishlistItemRemoval = async (cartItem) => {
      const wishlistItem = wishlistData.getLineItemByProductId(
        wishlist.value.items,
        {
          id: cartItem.product_id
        }
      );

      await removeItemFromWishlist({ wishlistItem });
    };

    const resetCouponError = () => {
      error.value.applyCoupon = null;
    };

    const handleWishlistClick = (product) =>
      !isInWishlist({ product: { id: product.product_id } })
        ? addItemToWishlist(createProductForWishlist(product))
        : handleWishlistItemRemoval(product);

    watch(couponError, () => {
      if (couponError.value?.detail) {
        setTimeout(resetCouponError, 5000);
      }
    });

    return {
      loading,
      isAuthenticated,
      cart,
      products,
      removeItem,
      updateItemQty,
      isCartSidebarOpen,
      toggleCartSidebar,
      totals,
      totalItems,
      cartData,
      clearCart,
      isEnabledWishlist,
      isInWishlist,
      addItemToWishlist,
      handleWishlistItemRemoval,
      appliedCoupon,
      allDiscounts,
      applyCouponCode,
      removeCouponCode,
      couponError,
      promoCode,
      handleQuantityChange,
      priceWithoutDiscounts,
      cartTax,
      createProductForWishlist,
      handleWishlistClick
    };
  }
});
</script>

<style lang="scss" scoped>
#cart {
  --sidebar-z-index: 3;
  --overlay-z-index: 3;
  @include for-desktop {
    & > * {
      --sidebar-bottom-padding: var(--spacer-base);
      --sidebar-content-padding: var(--spacer-base);
    }
  }
}

.cart-summary {
  margin-top: var(--spacer-xl);
}

.my-cart {
  flex: 1;
  display: flex;
  flex-direction: column;

  &__total-items {
    margin: 0;
  }

  &__total-price {
    --price-font-size: var(--font-size--xl);
    --price-font-weight: var(--font-weight--medium);
  }

  &__checkout-btn {
    margin-top: var(--spacer-base);
  }
}

.empty-cart {
  --heading-description-margin: 0 0 var(--spacer-xl) 0;
  --heading-title-margin: 0 0 var(--spacer-xl) 0;
  --heading-title-color: var(--c-primary);
  --heading-title-font-weight: var(--font-weight--semibold);
  display: flex;
  flex: 1;
  align-items: center;
  flex-direction: column;

  &__banner {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    flex: 1;
  }

  &__heading {
    padding: 0 var(--spacer-base);
  }

  &__image {
    --image-width: 16rem;
    margin: 0 0 var(--spacer-2xl) 7.5rem;
  }

  @include for-desktop {
    --heading-title-font-size: var(--font-size--xl);
    --heading-title-margin: 0 0 var(--spacer-sm) 0;
  }
}

.collected-product-list {
  flex: 1;
}

.collected-product {
  margin: 0 0 var(--spacer-sm) 0;

  &__properties {
    margin: var(--spacer-xs) 0 0 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-start;
    flex: 2;

    &:first-child {
      margin-bottom: 8px;
    }
  }

  &__actions {
    transition: opacity 150ms ease-in-out;
  }

  &__save,
  &__compare {
    --button-padding: 0;

    &:focus {
      --cp-save-opacity: 1;
      --cp-compare-opacity: 1;
    }
  }

  &__save {
    opacity: var(--cp-save-opacity, 0);
  }

  &__compare {
    opacity: var(--cp-compare-opacity, 0);
  }

  &:hover {
    --cp-save-opacity: 1;
    --cp-compare-opacity: 1;
    @include for-desktop {
      .collected-product__properties {
        display: none;
      }
    }
  }
}

.clear-cart {
  --button-padding: var(--spacer-sm) 0;
  background: transparent;
  color: var(--c-secondary);

  &::before {
    box-shadow: none;
  }
}

.bundle-components {
  font-size: var(--font-size--xs);

  &__heading {
    font-weight: var(--font-weight--bold);
    margin-bottom: 0;
  }

  &__list {
    list-style-type: none;
    margin-top: 0;
    padding: 0;
  }
}

.cart-coupon {
  display: flex;
  position: relative;
  margin: 1rem 0 1.5rem;

  &__input {
    flex-grow: 1;

    ::v-deep input {
      outline: 0;
    }
  }

  &__delete {
    cursor: pointer;
    font-size: 1.5rem;
    line-height: 1.5rem;
  }

  ::v-deep .sf-input__error-message {
    position: absolute;
  }
}
</style>

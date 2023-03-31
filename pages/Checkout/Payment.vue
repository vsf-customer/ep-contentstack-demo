<template>
  <div>
    <SfHeading
      :level="3"
      :title="$t('Payment')"
      class="sf-heading--left sf-heading--no-underline title"
    />

    <PromoCode class="promo-code smartphone-only" />

    <SfTable class="sf-table--bordered table desktop-only">
      <SfTableHeading class="table__row">
        <SfTableHeader class="table__header table__image">{{
          $t('Item')
        }}</SfTableHeader>
        <SfTableHeader
          v-for="tableHeader in tableHeaders"
          :key="tableHeader"
          class="table__header"
          :class="{ table__description: tableHeader === 'Description' }"
        >
          {{ $t(tableHeader) }}
        </SfTableHeader>
      </SfTableHeading>
      <SfTableRow
        v-for="(product, index) in products"
        :key="index"
        class="table__row"
      >
        <SfTableData class="table__image">
          <SfImage
            :src="cartData.getItemImage(product)"
            :alt="cartData.getItemName(product)"
            :image-tag="productGetters.getCoverImage(product) ? 'nuxt-img' : 'img'"
          />
        </SfTableData>
        <SfTableData class="table__data table__description table__data">
          <div class="product-title">
            {{ cartData.getItemName(product) }}
          </div>
          <div class="product-sku">{{ cartData.getItemSku(product) }}</div>
          <div
            class="bundle-components"
            v-if="cartData.getBundleComponents(product).length"
          >
            <p class="bundle-components__heading">
              {{ $t('Single quantity contains') }}:
            </p>
            <ul class="bundle-components__list">
              <li
                v-for="bundleComponent in cartData.getBundleComponents(product)"
                :key="bundleComponent.id"
              >
                {{ bundleComponent.name }} - x ({{ bundleComponent.quantity }})
              </li>
            </ul>
          </div>
        </SfTableData>
        <SfTableData class="table__data">{{
          cartData.getItemQty(product)
        }}</SfTableData>
        <SfTableData class="table__data price">
          <SfPrice
            :regular="cartData.getItemPriceFormatted(product).regular"
            :special="
              cartData.getItemPrice(product).special !== undefined &&
              cartData.getItemPriceFormatted(product).special
            "
            class="product-price"
          />
        </SfTableData>
      </SfTableRow>
    </SfTable>
    <div class="summary">
      <div class="summary__group">
        <div class="summary__total">
          <SfProperty
            :name="$t('Subtotal')"
            :value="totals.special > 0 ? totals.special : totals.subtotal"
            class="sf-property--full-width property"
          />

          <SfProperty
            :name="$t('Shipping')"
            :value="shippingMethod.price"
            class="sf-property--full-width property"
          />
          <SfProperty
            :name="$t('Tax')"
            :value="cartData.getValueFormatted(cartTax, cart)"
            v-if="cartTax"
            class="sf-property--full-width property"
          />
        </div>

        <SfDivider />

        <div
          class="sf-property--full-width sf-property--large sf-property summary__property-total"
          v-if="allDiscounts"
        >
          <span class="sf-property__name">{{ $t('All discounts') }}</span>
          <span class="sf-property__value">
            {{ cartData.getValueFormatted(allDiscounts, cart) }}
          </span>
        </div>

        <SfProperty
          :name="$t('Total price')"
          :value="totals.total"
          class="sf-property--full-width sf-property--large summary__property-total"
        />

        <SfDivider class="divider--primary" />

        <SfHeading
          :level="3"
          :title="$t('Payment methods')"
          class="sf-heading--left sf-heading--no-underline title"
        />
        <VsfPaymentProvider @status="selectPaymentMethod" />

        <SfCheckbox
          v-e2e="'terms'"
          v-model="terms"
          name="terms"
          class="summary__terms"
        >
          <template #label>
            <div class="sf-checkbox__label">
              {{ $t('I agree to Terms and conditions') }}
            </div>
          </template>
        </SfCheckbox>

        <div class="summary__action">
          <SfButton
            type="button"
            class="sf-button color-secondary summary__back-button"
            @click="$router.push(localePath('/checkout/billing'))"
          >
            {{ $t('Go back') }}
          </SfButton>
          <SfButton
            v-e2e="'make-an-order'"
            :disabled="!orderCanBePlaced"
            class="summary__action-button"
            @click="processOrder"
          >
            {{ $t('Make an order') }}
          </SfButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  SfHeading,
  SfTable,
  SfCheckbox,
  SfButton,
  SfDivider,
  SfImage,
  SfIcon,
  SfPrice,
  SfProperty,
  SfAccordion
} from '@storefront-ui/vue';
import {
  ref,
  computed,
  useRouter,
  defineComponent
} from '@nuxtjs/composition-api';
import PromoCode from '@/components/Checkout/PromoCode';
import {
  useCart,
  useCartData,
  useCheckout,
  useMakeOrder,
  useUiNotification
} from '@/composables';

export default defineComponent({
  name: 'ReviewOrder',
  components: {
    SfHeading,
    SfTable,
    SfCheckbox,
    SfButton,
    SfDivider,
    SfImage,
    SfIcon,
    SfPrice,
    SfProperty,
    SfAccordion,
    VsfPaymentProvider: () =>
      import('@/components/Checkout/VsfPaymentProvider'),
    PromoCode
  },
  setup() {
    const { send } = useUiNotification();
    const router = useRouter();
    const cartData = useCartData();
    const { cart, setCart, clear: clearCart } = useCart();
    const { order, make, loading, error } = useMakeOrder();
    const {
      data: checkoutData,
      setPaymentMethod,
      clear: clearCheckoutData
    } = useCheckout();
    const terms = ref(false);

    const selectPaymentMethod = async (method) => {
      await setPaymentMethod(method);
    };

    const cartCurrency = computed(() => cart.value?.items?.[0]?.value.currency);

    const allDiscounts = computed(() => {
      const discounts = cartData.getDiscounts(cart?.value);
      return discounts.length
        ? discounts.reduce((all, discount) => all + discount.value, 0)
        : null;
    });

    const cartTax = computed(() => cartData.getTax(cart.value));

    const processOrder = async () => {
      await make();
      const orderId = order.value?.id;

      if (error.value.make) {
        error.value.make?.response?.data?.errors?.map((error) =>
          send({ message: error.detail, type: 'danger', id: Symbol() })
        );
      } else if (orderId) {
        router.push(`/checkout/thank-you?order=${orderId}`);
        clearCheckoutData();
        await clearCart();
        setCart({
          ...cart.value,
          items: []
        });
      }
    };

    const orderCanBePlaced = computed(() => {
      return (
        !loading.value &&
        cart.value?.items?.filter((item) => item.type === 'cart_item').length &&
        checkoutData?.payment_method?.value &&
        terms.value &&
        checkoutData?.shipping_address?.isValid &&
        checkoutData?.billing_address?.isValid &&
        checkoutData?.customer?.isValid
      );
    });

    const currentShippingMethod = computed(() => {
      return {
        price:
          checkoutData &&
          checkoutData.shipping_method &&
          'price' in checkoutData.shipping_method
            ? cartData.getFormattedPrice(
              checkoutData?.shipping_method?.price,
              cartCurrency.value
            )
            : cartData.getFormattedPrice(0, cartCurrency.value)
      };
    });

    const totals = computed(() => {
      const cartSubtotals =
        cartData.getSubtotalWithoutDiscounts(cart.value) / 100;
      const deliveryPrice = checkoutData?.shipping_method?.price || 0;
      const displayTotal =
        cartSubtotals +
        deliveryPrice +
        cartTax.value / 100 +
        allDiscounts.value / 100;
      return {
        special: null,
        subtotal: cartData.getFormattedPrice(cartSubtotals, cartCurrency.value),
        total: cartData.getFormattedPrice(
          displayTotal > 0 ? displayTotal : 0,
          cartCurrency.value
        )
      };
    });

    return {
      terms,
      loading,
      cart,
      products: computed(
        () =>
          cartData
            .getItems(cart.value)
            ?.filter((item) => item.type === 'cart_item') || []
      ),
      shippingMethod: currentShippingMethod,
      totals,
      tableHeaders: ['Description', 'Quantity', 'Amount'],
      cartData,
      processOrder,
      checkoutData,
      orderCanBePlaced,
      selectPaymentMethod,
      allDiscounts,
      cartTax
    };
  }
});
</script>

<style lang="scss" scoped>
.title {
  margin: var(--spacer-xl) 0 var(--spacer-base) 0;
}
.table {
  margin: 0 0 var(--spacer-base) 0;
  &__row {
    justify-content: space-between;
  }
  @include for-desktop {
    &__header {
      text-align: center;
      &:last-child {
        text-align: right;
      }
    }
    &__data {
      text-align: center;
    }
    &__description {
      text-align: left;
      flex: 0 0 12rem;
    }
    &__image {
      --image-width: 5.125rem;
      text-align: left;
      margin: 0 var(--spacer-xl) 0 0;
    }
  }
}
.product-sku {
  color: var(--c-text-muted);
  font-size: var(--font-size--sm);
}
.price {
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
}
.product-price {
  --price-font-size: var(--font-size--base);
}
.summary {
  &__terms {
    margin: var(--spacer-base) 0 0 0;
  }
  &__total {
    margin: 0 0 var(--spacer-sm) 0;
    flex: 0 0 16.875rem;
  }
  &__action {
    margin-bottom: var(--spacer-xl);

    @include for-desktop {
      display: flex;
      margin: var(--spacer-xl) 0 0 0;
    }
  }
  &__action-button {
    width: 100%;
    margin: var(--spacer-sm) 0 0 0;
    @include for-desktop {
      margin: 0 var(--spacer-xl) 0 0;
      width: auto;
    }
    &--secondary {
      @include for-desktop {
        text-align: right;
      }
    }
  }
  &__back-button {
    margin: var(--spacer-xl) 0 0 0;
    width: 100%;
    @include for-desktop {
      margin: 0 var(--spacer-xl) 0 0;
      width: auto;
    }
    color: var(--c-white);
    &:hover {
      color: var(--c-white);
    }
  }
  &__property-total {
    margin: var(--spacer-base) 0 var(--spacer-base) 0;
  }
}
.property {
  margin: 0 0 var(--spacer-sm) 0;
  &__name {
    color: var(--c-text-muted);
  }
}
.accordion {
  margin: 0 0 var(--spacer-xl) 0;
  &__item {
    display: flex;
    align-items: flex-start;
  }
  &__content {
    flex: 1;
  }
  &__edit {
    flex: unset;
  }
}
.content {
  margin: 0 0 var(--spacer-xl) 0;
  color: var(--c-text);
  &:last-child {
    margin: 0;
  }
  &__label {
    font-weight: var(--font-weight--normal);
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
.divider {
  &--primary {
    border-color: var(--c-primary);
  }
}
.promo-code {
  margin: var(--spacer-lg) 0;
}
</style>

<style lang="scss">
.table__image {
  .sf-image--placeholder {
    @include for-desktop {
      max-width: 5.125rem;
    }
  }
}
</style>

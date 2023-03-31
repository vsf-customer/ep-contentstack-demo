<template>
  <div id="order-summary" class="highlighted">
    <SfHeading
      :title="$t('Order summary')"
      :level="3"
      class="sf-heading--left sf-heading--no-underline title"
    />

    <SfProperty
      :name="$t('Products')"
      :value="totalItems"
      class="sf-property--full-width sf-property--large property"
    />
    <SfProperty
      :name="$t('Subtotal')"
      :value="totals.subtotal"
      class="sf-property--full-width sf-property--large property"
    />
    <SfProperty
      :name="$t('Shipping')"
      :value="shippingMethod.price"
      class="sf-property--full-width sf-property--large property"
    />
    <SfProperty
      :name="$t('Tax')"
      :value="cartData.getValueFormatted(cartTax, cart)"
      v-if="cartTax"
      class="sf-property--full-width sf-property--large property"
    />

    <SfDivider class="divider" />

    <div
      class="sf-property--full-width sf-property--large property sf-property"
      v-if="allDiscounts"
    >
      <span class="sf-property__name">{{ $t('All discounts') }}</span>
      <span class="sf-property__value">
        {{ cartData.getValueFormatted(allDiscounts, cart) }}
      </span>
    </div>

    <SfProperty
      :name="$t('Total')"
      :value="totals.total"
      class="
        sf-property--full-width sf-property--large
        property property--total
      "
    />

    <PromoCode />

    <div class="characteristics">
      <SfCharacteristic
        v-for="(characteristic, index) in characteristics"
        :key="characteristic.title || index"
        :title="characteristic.title"
        :description="characteristic.description"
        :icon="characteristic.icon"
        size-icon="32px"
        color-icon="green-primary"
        class="characteristics__item"
      />
    </div>
    <div class="actions smartphone-only">
      <SfButton
        class="sf-button--full-width actions__button"
        @click="$emit('click:next')"
      >
        {{ buttonName }}
      </SfButton>

      <SfButton
        class="sf-button--text actions__button actions__button--secondary"
        @click="$emit('click:back')"
      >
        {{ $t('Go back') }}
      </SfButton>
    </div>
  </div>
</template>

<script lang="ts">
import {
  SfHeading,
  SfButton,
  SfDivider,
  SfProperty,
  SfCharacteristic,
  SfInput
} from '@storefront-ui/vue';
import { computed, defineComponent, PropType } from '@nuxtjs/composition-api';
import PromoCode from './PromoCode.vue';
import { useCart, useCartData, useCheckout } from '@/composables';

export default defineComponent({
  name: 'CartPreview',
  components: {
    SfHeading,
    SfButton,
    SfDivider,
    SfProperty,
    SfCharacteristic,
    SfInput,
    PromoCode
  },
  props: {
    characteristics: {
      type: Array as PropType<
        Array<{ icon: string; description: string; title?: string }>
      >,
      default: () => []
    },
    buttonName: {
      type: String,
      default: ''
    }
  },
  setup() {
    const cartData = useCartData();
    const { cart, loading: cartLoading } = useCart();
    const { data: checkoutData } = useCheckout();

    const cartCurrency = computed(() => cart.value?.items?.[0]?.value.currency);

    const allDiscounts = computed(() => {
      const discounts = cartData.getDiscounts(cart?.value);
      return discounts.length
        ? discounts.reduce((all, discount) => all + discount.value, 0)
        : null;
    });

    const totalItems = computed(() => {
      const count = cartData.getTotalItems(cart.value);
      return count ? count.toString() : null;
    });
    const cartTax = computed(() => cartData.getTax(cart.value));

    const currentShippingMethod = computed(() => {
      return {
        price:
          checkoutData &&
          checkoutData.shipping_method &&
          'price' in checkoutData.shipping_method
            ? cartData.getFormattedPrice(
              checkoutData.shipping_method.price,
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
      totalItems,
      totals,
      shippingMethod: currentShippingMethod,
      cartLoading,
      cart,
      cartData,
      allDiscounts,
      cartTax
    };
  }
});
</script>

<style lang="scss" scoped>
@import '~@storefront-ui/vue/styles';

.highlighted {
  box-sizing: border-box;
  background-color: var(--c-light);
  padding: var(--spacer-xl);
}

.title {
  --heading-title-margin: 0 0 var(--spacer-xl) 0;
  --heading-title-font-weight: var(--font-weight--bold);
  --heading-padding: 0;
  --heading-title-margin: 0 0 var(--spacer-xl) 0;
  @include for-desktop {
    --heading-title-font-weight: var(--font-weight--semibold);
  }
}
.property {
  margin: var(--spacer-base) 0;
  --property-name-font-weight: var(--font-weight--medium);
  --property-value-font-weight: var(--font-weight--semibold);
  &:last-of-type {
    margin: var(--spacer-base) 0 var(--spacer-xl);
    --property-name-color: var(--c-text);
  }
  &--total {
    padding-top: var(--spacer-xs);
    --property-name-font-weight: var(--font-weight--semibold);
  }
}
.divider {
  --divider-border-color: var(--c-white);
  --divider-margin: var(--spacer-xl) 0 0 0;
}
.characteristics {
  &__item {
    margin: var(--spacer-base) 0;
    &:last-of-type {
      margin: 0;
    }
  }
}
</style>

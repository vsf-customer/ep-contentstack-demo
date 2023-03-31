<template>
  <div class="promo-code" v-if="appliedCoupon">
    <div
      class="sf-property--full-width sf-property--large property sf-property"
    >
      <span class="sf-property__name">{{ $t('Applied coupon') }}</span>
      <div class="sf-property__value">
        <span>{{ appliedCoupon.code }}</span>
        <div
          class="promo-code__delete"
          @click="removeCouponCode"
          :title="$t('Remove coupon')"
        >
          &times;
        </div>
      </div>
    </div>
  </div>
  <div class="promo-code" v-else>
    <SfInput
      v-model="promoCode"
      name="promoCode"
      :label="$t('Enter promo code')"
      class="sf-input--filled promo-code__input"
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

<script lang="ts">
import { SfButton, SfInput } from '@storefront-ui/vue';
import { computed, defineComponent, ref } from '@nuxtjs/composition-api';
import { useCart, useCartData } from '@/composables';

export default defineComponent({
  name: 'PromoCode',
  components: {
    SfButton,
    SfInput
  },
  setup() {
    const cartData = useCartData();
    const { cart, applyCoupon, removeCoupon, error } = useCart();
    const promoCode = ref('');
    const couponError = computed(
      () =>
        (error.value.applyCoupon as any)?.response?.data?.errors?.[0] ??
        error.value.applyCoupon
    );
    const appliedCoupon = computed(() => {
      const coupons = cartData.getCoupons(cart?.value);
      return coupons.length ? coupons[0] : null;
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

    return {
      promoCode,
      applyCouponCode,
      appliedCoupon,
      removeCouponCode,
      couponError
    };
  }
});
</script>

<style lang="scss" scoped>
.promo-code {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  &__input {
    --input-background: var(--c-white);
    --input-label-font-size: var(--font-size--xs);
    flex: 1;
  }
  &__button {
    --button-height: 1.875rem;
  }
  &__delete {
    display: inline-block;
    color: red;
    font-size: var(--h3-font-size);
    line-height: var(--font-size--base);
    font-weight: var(--font-weight--bold);
    cursor: pointer;
    position: relative;
    top: 1px;

    @include for-mobile {
      font-size: calc(var(--h1-font-size) * 1.4);
      top: 3px;
    }
  }
  .property {
    margin-bottom: 0;
  }
}
</style>

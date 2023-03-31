<template>
  <div>
    <SfRadio
      v-e2e="'payment-method'"
      v-for="method in paymentMethods"
      :key="method.value"
      :label="method.label"
      :value="method.value"
      :description="method.description"
      :selected="selectedMethod.value"
      name="shippingMethod"
      class="form__radio shipping"
      @change="selectMethod(method)"
    >
      <div class="shipping__label">
        {{ method.label }}
      </div>
    </SfRadio>
  </div>
</template>

<script>
import { useCheckout } from '@/composables';
import { SfButton, SfRadio } from '@storefront-ui/vue';
import { computed, defineComponent } from '@nuxtjs/composition-api';

const PAYMENT_METHODS = [{ label: 'Cash on delivery', value: 'manual' }];

export default defineComponent({
  name: 'VsfPaymentProvider',

  components: {
    SfButton,
    SfRadio
  },

  setup(props, { emit }) {
    const { data: checkoutData } = useCheckout();
    const selectedMethod = computed(
      () => checkoutData?.payment_method || ''
    );

    const selectMethod = async (method) => {
      emit('status', method);
    };

    return {
      paymentMethods: PAYMENT_METHODS,
      selectedMethod,
      selectMethod
    };
  }
});
</script>

<style lang="scss" scoped>
.shipping {
  &__label {
    display: flex;
    justify-content: space-between;
  }

  &__description {
    --radio-description-margin: 0;
    --radio-description-font-size: var(--font-xs);
  }
}
</style>

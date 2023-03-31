<template>
  <div>
    <SfRadio
      v-for="method in shippingMethods"
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

      <div class="shipping__description">
        {{ method.description }}
      </div>
    </SfRadio>
  </div>
</template>

<script>
import { SfButton, SfRadio } from '@storefront-ui/vue';
import { computed, defineComponent } from '@nuxtjs/composition-api';
import { useFetch } from '@nuxtjs/composition-api';
import { useCheckout, useShippingProvider } from '@/composables';

export default defineComponent({
  name: 'VsfShippingProvider',
  components: {
    SfButton,
    SfRadio
  },

  setup(props, { emit }) {
    const { data: checkoutData } = useCheckout();
    const selectedMethod = computed(
      () => checkoutData?.shipping_method || ''
    );
    const { load: loadShippingMethods, state: shippingMethods } =
      useShippingProvider();

    const selectMethod = async (method) => {
      emit('status', method);
    };

    useFetch(async () => {
      await loadShippingMethods();
    });

    return {
      shippingMethods,
      selectMethod,
      selectedMethod
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

<template>
  <div id="checkout">
    <div class="checkout">
      <SfLoader :class="{ loading: isUserLoading }" :loading="isUserLoading">
        <div class="checkout__main">
          <SfSteps
            v-if="!isThankYou"
            :active="currentStepIndex"
            :class="{ checkout__steps: true }"
            @change="handleStepClick"
          >
            <SfStep v-for="(step, key) in steps" :key="key" :name="$t(step)">
              <nuxt-child />
            </SfStep>
          </SfSteps>
          <nuxt-child v-else />
        </div>
      </SfLoader>

      <div v-if="!isThankYou" class="checkout__aside desktop-only">
        <transition name="fade">
          <CartPreview key="order-summary" />
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import {
  computed,
  useContext,
  useRoute,
  useRouter,
  defineComponent
} from '@nuxtjs/composition-api';
import { useUser, useCheckout } from '@/composables';
import CartPreview from '@/components/Checkout/CartPreview';
import { SfSteps, SfButton, SfLoader } from '@storefront-ui/vue';

const STEPS = {
  shipping: 'Shipping',
  billing: 'Billing',
  payment: 'Payment'
};

export default defineComponent({
  name: 'Checkout',
  components: {
    SfButton,
    SfSteps,
    SfLoader,
    CartPreview
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { setCustomer } = useCheckout();
    const { isAuthenticated, loading: isUserLoading, user } = useUser();
    const { localePath } = useContext();

    const steps = computed(() =>
      isAuthenticated.value
        ? { ...STEPS }
        : {
          personalDetails: 'Details',
          ...STEPS
        }
    );

    const currentStep = computed(() => {
      const { path } = route.value;
      const stepFromPath = path.split('/').pop();
      if (
        Object.keys(STEPS).includes(stepFromPath) ||
        stepFromPath === 'thank-you'
      ) {
        return stepFromPath;
      }

      if (isAuthenticated.value) {
        setCustomer({ id: user?.value?.id, isValid: true });
        router.push(localePath('/checkout/shipping'));
        return 'shipping';
      } else {
        if (stepFromPath === 'personalDetails') {
          return stepFromPath;
        }

        router.push(localePath('/checkout/personalDetails'));
        return 'personalDetails';
      }
    });

    const currentStepIndex = computed(() =>
      Object.keys(steps.value).findIndex((s) => s === currentStep.value)
    );
    const isThankYou = computed(() => currentStep.value === 'thank-you');

    const handleStepClick = (stepIndex) => {
      const key = Object.keys(steps.value)[stepIndex];
      router.push(localePath(`/checkout/${key}`));
    };

    return {
      handleStepClick,
      steps,
      currentStepIndex,
      isThankYou,
      currentStep,
      isUserLoading
    };
  }
});
</script>

<style lang="scss" scoped>
#checkout {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1240px;
    margin: 0 auto;
  }
}
.checkout {
  @include for-desktop {
    display: flex;
  }
  &__main {
    @include for-desktop {
      flex: 1;
      padding: var(--spacer-xl) 0 0 0;
    }
  }
  &__aside {
    @include for-desktop {
      flex: 0 0 25.5rem;
      margin: 0 0 0 4.25rem;
    }
  }
  &__steps {
    --steps-content-padding: 0 var(--spacer-base);
    @include for-desktop {
      --steps-content-padding: 0;
    }

    &-auth::v-deep .sf-steps__step:first-child {
      --steps-step-color: #e8e4e4;
    }
  }
}
.loading {
  min-height: 150px;
}
</style>

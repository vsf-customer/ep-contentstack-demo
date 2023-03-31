<template>
  <div id="personal-details">
    <div class="log-in">
      <SfButton
        class="log-in__button sf-button--full-width color-secondary"
        @click="toggleLoginModal"
        >{{ $t('Log into your account') }}</SfButton
      >
      <p class="log-in__info">{{ $t('or fill the details below') }}:</p>
    </div>
    <SfHeading
      :title="$t('Personal details')"
      :level="3"
      class="sf-heading--left sf-heading--no-underline title"
    />
    <ValidationObserver v-slot="{ handleSubmit }" key="checkout-registration">
      <form @submit.prevent="handleSubmit(onSubmit)" class="form">
        <ValidationProvider v-slot="{ errors }" rules="required|max:100" slim>
          <SfInput
            v-model="form.firstName"
            :label="$t('First name')"
            name="firstName"
            required
            class="form__element form__element--half"
            :valid="!errors[0]"
            :error-message="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider v-slot="{ errors }" rules="required|max:100" slim>
          <SfInput
            v-model="form.lastName"
            :label="$t('Last name')"
            name="lastName"
            class="form__element form__element--half form__element--half-even"
            required
            :valid="!errors[0]"
            :error-message="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider
          v-slot="{ errors }"
          rules="required|email|max:100"
          class="form__element"
        >
          <SfInput
            v-model="form.email"
            :label="$t('Your email')"
            name="email"
            required
            :valid="!errors[0]"
            :error-message="errors[0]"
          />
        </ValidationProvider>
        <div>
          <SfCheckbox
            v-model="form.createAccount"
            name="createAccount"
            :label="$t('I want to create an account')"
            class="form__checkbox"
            data-testid="create-account-checkbox"
          />
        </div>
        <transition name="sf-fade">
          <ValidationProvider
            v-if="form.createAccount"
            v-slot="{ errors }"
            rules="required|password"
            class="form__element"
          >
            <SfInput
              v-model="form.password"
              :has-show-password="true"
              type="password"
              :label="$t('Create Password')"
              class="form__element"
              required
              data-testid="create-password-input"
              :valid="!errors[0]"
              :error-message="errors[0]"
            />

            <p class="error" v-if="accountError">
              {{ accountError }}
            </p>
          </ValidationProvider>
        </transition>
        <SfButton class="sf-button--full-width" type="submit">{{
          $t('Continue')
        }}</SfButton>
      </form>
    </ValidationObserver>
  </div>
</template>

<script>
import {
  ref,
  computed,
  watch,
  useContext,
  useRouter,
  defineComponent
} from '@nuxtjs/composition-api';
import { SfInput, SfCheckbox, SfButton, SfHeading } from '@storefront-ui/vue';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { email } from 'vee-validate/dist/rules';
import { useUiState, useUser, useCheckout, useUiNotification } from '@/composables';

export default defineComponent({
  name: 'PersonalDetails',
  components: {
    SfInput,
    SfCheckbox,
    SfButton,
    SfHeading,
    ValidationProvider,
    ValidationObserver
  },
  setup() {
    const { localePath } = useContext();
    const { send } = useUiNotification();
    const router = useRouter();
    const { toggleLoginModal } = useUiState();
    const { register, user, error: userError, isAuthenticated } = useUser();
    const { setCustomer, data: checkoutData } = useCheckout();
    const isFormSubmitted = ref(false);
    const accountError = ref(null);
    const { i18n } = useContext();

    extend('email', {
      ...email,
      message: i18n.t('Invalid email.')
    });

    setCustomer({ isValid: false });

    const form = ref({
      firstName: checkoutData?.customer?.firstName || '',
      lastName: checkoutData?.customer?.lastName || '',
      email: checkoutData?.customer?.email || '',
      password: checkoutData?.customer?.password || '',
      createAccount:
        checkoutData?.customer?.createAccount !== undefined
          ? checkoutData?.customer?.createAccount
          : false
    });

    const onSubmit = computed(() => async () => {
      accountError.value = null;

      await setCustomer({
        firstName: form.value.firstName,
        lastName: form.value.lastName,
        email: form.value.email,
        name: `${form.value.firstName} ${form.value.lastName}`,
        password: form.value.password,
        createAccount: form.value.createAccount,
        isValid: true
      });

      if (form.value.createAccount) {
        await register({
          user: {
            email: form.value.email,
            password: form.value.password,
            firstName: form.value.firstName,
            lastName: form.value.lastName
          }
        });

        const userErrors = userError.value.register || userError.value.login;
        if (!user.value?.id || userErrors) {
          accountError.value =
            userErrors?.response?.data?.errors?.[0]?.detail ??
            userErrors?.message;
          userErrors ||
            i18n.t('An error occured at creating your account. Please try again.');

          send({ message: userErrors.message, type: 'danger', id: Symbol() });

          return;
        }

        await setCustomer({
          id: user.value.id,
          isValid: true
        });
      }

      router.push(localePath('/checkout/shipping'));
    });

    watch(isAuthenticated, () => {
      if (isAuthenticated) {
        router.push(localePath('/checkout/shipping'));
      }
    });

    return {
      onSubmit,
      form,
      isFormSubmitted,
      toggleLoginModal,
      accountError
    };
  }
});
</script>

<style lang="scss" scoped>
@import '~@storefront-ui/vue/styles';

.title {
  --heading-padding: var(--spacer-xl) 0 var(--spacer-base);
  --heading-title-font-weight: var(--font-weight--bold);
  @include for-desktop {
    --heading-title-font-size: var(--h3-font-size);
    --heading-title-font-weight: var(--font-weight--semibold);
    --heading-padding: var(--spacer-xl) 0;
  }
}
.log-in {
  &__info {
    margin: 0;
    color: var(--c-dark-variant);
    font: var(--font-weight--medium) var(--font-size--base) / 1.6
      var(--font-family--secondary);
    @include for-desktop {
      font-weight: var(--font-weight--normal);
    }
  }
  &__button {
    margin: var(--spacer-xl) 0 var(--spacer-base) 0;
    @include for-desktop {
      margin: var(--spacer-xl) 0;
      --button-width: 25rem;
    }
  }
}
.info {
  &__heading {
    font-family: var(--font-family--secondary);
    font-weight: var(--font-weight--medium);
    color: var(--c-link);
    margin-bottom: var(--spacer-base);
  }
  @include for-desktop {
    width: 37.5rem;
    display: flex;
    flex-wrap: wrap;
    margin: 0;
    &__heading {
      flex: 100%;
      margin: 0 0 var(--spacer-lg) 0;
    }
  }
}
.form {
  &__element {
    --input-padding: var(--spacer-sm) 0 var(--spacer-2xs) 0;
    margin: 0 0 var(--spacer-base) 0;
  }
  &__checkbox {
    margin: var(--spacer-base) 0 var(--spacer-xl);
    --checkbox-font-family: var(--font-family--primary);
    --checkbox-font-size: var(--font-size--base);
  }
  &__action-button {
    &:first-child {
      margin: var(--spacer-sm) 0 0 0;
    }
    &--secondary {
      margin: var(--spacer-base) 0;
    }
    @include for-desktop {
      --button-width: 25rem;
    }
  }
  @include for-desktop {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    &__element {
      margin: 0 0 var(--spacer-base) 0;
      flex: 0 0 100%;
      &--half {
        flex: 1 1 50%;
        &-even {
          padding: 0 0 0 var(--spacer-base);
        }
      }
    }
    &__checkbox {
      margin: var(--spacer-lg) 0 var(--spacer-xl);
    }
  }
}
.error {
  color: red;
  font-weight: bold;
}
</style>

<template>
  <ValidationObserver v-slot="{ handleSubmit }">
    <SfHeading
      v-e2e="'billing-heading'"
      :level="3"
      :title="$t('Billing')"
      class="sf-heading--left sf-heading--no-underline title"
    />

    <section v-if="addresses.length" class="saved-addresses">
      <SfHeading
        v-e2e="'billing-heading'"
        :level="4"
        :title="$t('Saved addresses')"
        class="sf-heading--left sf-heading--no-underline title"
      />
      <div class="saved-addresses__buttons">
        <SfButton
          v-for="(address, index) in addresses"
          :key="address ? address.name + index : index"
          class="color-light"
          @click="loadAddressIntoForm(index)"
        >
          {{ address && address.name }}
        </SfButton>
      </div>
    </section>

    <form @submit.prevent="handleSubmit(handleFormSubmit)">
      <div class="form">
        <ValidationProvider
          name="first_name"
          rules="required|max:100"
          v-slot="{ errors }"
          slim
        >
          <SfInput
            v-e2e="'billing-first_name'"
            v-model="form.first_name"
            :label="$t('First name')"
            name="first_name"
            class="form__element form__element--half"
            required
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider
          name="last_name"
          rules="required|max:100"
          v-slot="{ errors }"
          slim
        >
          <SfInput
            v-e2e="'billing-last_name'"
            v-model="form.last_name"
            :label="$t('Last name')"
            name="last_name"
            class="form__element form__element--half form__element--half-even"
            required
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider
          name="line_1"
          rules="required|max:255"
          v-slot="{ errors }"
          slim
        >
          <SfInput
            v-e2e="'billing-line_1'"
            v-model="form.line_1"
            :label="$t('Address line 1')"
            name="line_1"
            class="form__element form__element--half"
            required
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider
          name="line_2"
          v-slot="{ errors }"
          rules="max:255"
          slim
        >
          <SfInput
            v-e2e="'billing-line_2'"
            v-model="form.line_2"
            :label="$t('Address line 2')"
            name="line_2"
            class="form__element form__element--half form__element--half-even"
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider
          name="city"
          rules="required|max:100"
          v-slot="{ errors }"
          slim
        >
          <SfInput
            v-e2e="'billing-city'"
            v-model="form.city"
            :label="$t('City')"
            name="city"
            class="form__element form__element--half"
            required
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider name="county" slim rules="required|min:2|max:100">
          <SfInput
            v-e2e="'billing-county'"
            v-model="form.county"
            :label="$t('County')"
            name="county"
            required
            class="form__element form__element--half form__element--half-even"
          />
        </ValidationProvider>
        <ValidationProvider
          name="country"
          rules="required|min:2"
          v-slot="{ errors }"
          slim
        >
          <SfSelect
            v-e2e="'billing-country'"
            v-model="form.country"
            :label="$t('Country')"
            name="country"
            class="form__element form__element--half form__select sf-select--underlined"
            required
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          >
            <SfSelectOption
              v-for="countryCode in Object.keys(countries)"
              :key="countryCode"
              :value="countryCode"
            >
              {{ countries[countryCode] }}
            </SfSelectOption>
          </SfSelect>
        </ValidationProvider>
        <ValidationProvider
          name="postcode"
          rules="required|max:30"
          v-slot="{ errors }"
          slim
        >
          <SfInput
            v-e2e="'billing-zipcode'"
            v-model="form.postcode"
            :label="$t('Post code')"
            name="postcode"
            class="form__element form__element--half form__element--half-even"
            required
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider
          name="phone"
          rules="max:50"
          v-slot="{ errors }"
          slim
        >
          <SfInput
            v-e2e="'billing-phone'"
            v-model="form.phone"
            :label="$t('Phone number')"
            name="phone"
            class="form__element form__element--half"
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          />
        </ValidationProvider>
      </div>
      <div class="form">
        <div class="form__action">
          <SfButton
            class="sf-button color-secondary form__back-button"
            type="button"
            @click="$router.push(localePath('/checkout/shipping'))"
          >
            {{ $t('Go back') }}
          </SfButton>
          <SfButton
            v-e2e="'continue-to-payment'"
            class="form__action-button"
            type="submit"
          >
            {{ $t('Continue to payment') }}
          </SfButton>
        </div>
      </div>
    </form>
  </ValidationObserver>
</template>

<script>
import {
  useUser,
  useCheckout,
  useUserBilling,
  useUserAddressData
} from '@/composables';
import {
  SfInput,
  SfRadio,
  SfButton,
  SfSelect,
  SfHeading,
  SfCheckbox
} from '@storefront-ui/vue';
import {
  ref,
  computed,
  useContext,
  useRouter,
  onMounted,
  defineComponent
} from '@nuxtjs/composition-api';
import { AVAILABLE_COUNTRIES } from '@/constants';
import { required, min, digits } from 'vee-validate/dist/rules';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';

extend('required', {
  ...required,
  message: 'This field is required'
});
extend('min', {
  ...min,
  message: 'The field should have at least {length} characters'
});
extend('digits', {
  ...digits,
  message: 'Please provide a valid phone number'
});

export default defineComponent({
  name: 'Billing',
  components: {
    SfHeading,
    SfInput,
    SfButton,
    SfSelect,
    SfRadio,
    SfCheckbox,
    ValidationProvider,
    ValidationObserver
  },
  setup() {
    const { localePath } = useContext();
    const router = useRouter();
    const {
      data: checkoutData,
      setBillingAddress,
      setShippingAddress
    } = useCheckout();
    const { isAuthenticated } = useUser();
    const { load, billing } = useUserBilling();
    const userAddressData = useUserAddressData();
    const loadingAddresses = ref(false);
    const addresses = computed(() =>
      userAddressData.getAddresses(billing.value)
    );

    const form = ref({
      first_name: '',
      last_name: '',
      line_1: '',
      line_2: '',
      city: '',
      county: '',
      country: '',
      postcode: '',
      phone: ''
    });

    const loadAddressIntoForm = (index = null) => {
      let loadedAddress = {};

      if (Array.isArray(addresses.value) && addresses.value.length) {
        /* TODO: find address by the "default" attribute instead of the 0th element when not providing a name */
        loadedAddress = !isAuthenticated.value
          ? {}
          : index !== null
            ? addresses.value[index]
            : addresses.value[0];

        if (index !== null) {
          setBillingAddress(
            {},
            {
              override: true
            }
          );
        }
      }

      form.value = {
        first_name:
          checkoutData?.billing_address?.first_name ||
          userAddressData.getFirstName(loadedAddress),
        last_name:
          checkoutData?.billing_address?.last_name ||
          userAddressData.getLastName(loadedAddress),
        line_1:
          checkoutData?.billing_address?.line_1 ||
          userAddressData.getLine1(loadedAddress),
        line_2:
          checkoutData?.billing_address?.line_2 ||
          userAddressData.getLine2(loadedAddress),
        city:
          checkoutData?.billing_address?.city ||
          userAddressData.getCity(loadedAddress),
        county:
          checkoutData?.billing_address?.county ||
          userAddressData.getCounty(loadedAddress),
        country:
          checkoutData?.billing_address?.country ||
          userAddressData.getCountry(loadedAddress),
        postcode:
          checkoutData?.billing_address?.postcode ||
          userAddressData.getPostCode(loadedAddress),
        phone:
          checkoutData?.billing_address?.phone ||
          userAddressData.getPhone(loadedAddress)
      };
    };

    onMounted(async () => {
      await load();
      loadAddressIntoForm();
    });

    const handleFormSubmit = async () => {
      await setBillingAddress({ ...form.value, isValid: true });

      if (checkoutData?.shipping_address?.isSameAsBilling) {
        await setShippingAddress({
          ...checkoutData.shipping_address,
          isSameAsBilling: false
        });
      }

      router.push(localePath('/checkout/payment'));
    };

    return {
      form,
      countries: AVAILABLE_COUNTRIES,
      handleFormSubmit,
      loading: loadingAddresses,
      addresses,
      loadAddressIntoForm
    };
  }
});
</script>

<style lang="scss" scoped>
.saved-addresses {
  margin: 0 0 var(--spacer-xl) 0;

  &__buttons {
    display: flex;
    flex-direction: row;
    column-gap: var(--spacer-sm);
    row-gap: var(--spacer-sm);
    flex-wrap: wrap;

    .sf-button {
      padding: var(--spacer-xs) var(--spacer-sm);
    }
  }
}
.title {
  margin: var(--spacer-xl) 0 var(--spacer-base) 0;
}
.form {
  &__select {
    display: flex;
    align-items: center;
    --select-option-font-size: var(--font-size--lg);
    ::v-deep .sf-select__dropdown {
      font-size: var(--font-size--lg);
      margin: 0;
      color: var(--c-text);
      font-family: var(--font-family--secondary);
      font-weight: var(--font-weight--normal);
    }
  }
  @include for-desktop {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }
  &__element {
    margin: 0 0 var(--spacer-xl) 0;
    @include for-desktop {
      flex: 0 0 100%;
    }
    &--half {
      @include for-desktop {
        flex: 1 1 50%;
      }
      &-even {
        @include for-desktop {
          padding: 0 0 0 var(--spacer-xl);
        }
      }
    }
  }
  &__group {
    display: flex;
    align-items: center;
  }
  &__action {
    @include for-desktop {
      flex: 0 0 100%;
      display: flex;
    }
  }
  &__action-button,
  &__back-button {
    --button-width: 100%;
    @include for-desktop {
      --button-width: auto;
    }
  }
  &__action-button {
    &--secondary {
      @include for-desktop {
        order: -1;
        --button-margin: 0;
        text-align: left;
      }
    }
    &--add-address {
      width: 100%;
      margin: 0;
      @include for-desktop {
        margin: 0 0 var(--spacer-lg) 0;
        width: auto;
      }
    }
  }
  &__back-button {
    margin: var(--spacer-xl) 0 var(--spacer-sm);
    &:hover {
      color: white;
    }
    @include for-desktop {
      margin: 0 var(--spacer-xl) 0 0;
    }
  }
  &__back-button {
    margin: 0 0 var(--spacer-sm) 0;
    @include for-desktop {
      margin: 0 var(--spacer-xl) 0 0;
    }
  }
}
.payment-methods {
  @include for-desktop {
    display: flex;
    padding: var(--spacer-lg) 0;
    border: 1px solid var(--c-light);
    border-width: 1px 0;
  }
}
.payment-method {
  --radio-container-align-items: center;
  --ratio-content-margin: 0 0 0 var(--spacer-base);
  --radio-label-font-size: var(--font-base);
  --radio-background: transparent;
  white-space: nowrap;
  border: 1px solid var(--c-light);
  border-width: 1px 0 0 0;
  &:last-child {
    border-width: 1px 0;
  }
  --radio-background: transparent;
  @include for-desktop {
    border: 0;
    --radio-border-radius: 4px;
  }
}
</style>

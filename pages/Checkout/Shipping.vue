<template>
  <ValidationObserver v-slot="{ handleSubmit }">
    <SfHeading
      v-e2e="'shipping-heading'"
      :level="3"
      :title="$t('Shipping')"
      class="sf-heading--left sf-heading--no-underline title"
    />

    <section v-if="addresses.length" class="saved-addresses">
      <SfHeading
        v-e2e="'shipping-heading'"
        :level="4"
        :title="$t('Saved addresses')"
        class="sf-heading--left sf-heading--no-underline title"
      />
      <div class="saved-addresses__buttons">
        <SfButton
          v-for="(address, index) in addresses"
          :key="address.name + index"
          class="color-light"
          @click="loadAddressIntoForm(index)"
        >
          {{ address.name }}
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
            v-e2e="'shipping-first_name'"
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
            v-e2e="'shipping-last_name'"
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
            v-e2e="'shipping-line-1'"
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
            v-e2e="'shipping-line-2'"
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
            v-e2e="'shipping-city'"
            v-model="form.city"
            :label="$t('City')"
            name="city"
            class="form__element form__element--half"
            required
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider
          name="county"
          rules="required|min:2|max:100"
          v-slot="{ errors }"
          slim
        >
          <SfInput
            v-e2e="'shipping-state'"
            v-model="form.county"
            :label="$t('County')"
            name="county"
            class="form__element form__element--half form__element--half-even"
            required
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider
          name="country"
          rules="required|min:2"
          v-slot="{ errors }"
          slim
        >
          <SfSelect
            v-e2e="'shipping-country'"
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
            v-e2e="'shipping-postcode'"
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
            v-e2e="'shipping-phone'"
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
        <SfCheckbox
          v-model="form.isSameAsBilling"
          name="isSameAsBilling"
          :label="$t('Same as billing address')"
          class="form__checkbox form__element form__element--half"
        />
      </div>

      <section class="shipping-method">
        <SfHeading
          :level="4"
          :title="$t('Select shipping method')"
          class="sf-heading--left sf-heading--no-underline title"
        />

        <ValidationProvider rules="required" slim v-slot="{ errors, valid }">
          <VsfShippingProvider
            v-model="selectedMethod.id"
            @status="(method) => selectShippingMethod(method)"
          />

          <transition name="sf-fade">
            <div
              :class="{
                'sf-input__error-message': true,
                'display-none': valid
              }"
            >
              {{ errors[0] }}
            </div>
          </transition>
        </ValidationProvider>
      </section>

      <SfButton
        v-if="!isFormSubmitted"
        class="form__action-button"
        type="submit"
      >
        {{
          $t(
            billingCanBeSkipped ? 'Continue to payment' : 'Continue to billing'
          )
        }}
      </SfButton>
    </form>
  </ValidationObserver>
</template>

<script>
import {
  useUser,
  useCheckout,
  useUserShipping,
  useUserAddressData
} from '@/composables';
import {
  SfInput,
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
  name: 'Shipping',
  components: {
    SfHeading,
    SfInput,
    SfButton,
    SfSelect,
    SfCheckbox,
    ValidationProvider,
    ValidationObserver,
    VsfShippingProvider: () =>
      import('@/components/Checkout/VsfShippingProvider')
  },
  setup() {
    const { localePath } = useContext();
    const router = useRouter();
    const isFormSubmitted = ref(false);
    const { isAuthenticated } = useUser();
    const { load, shipping } = useUserShipping();
    const {
      data: checkoutData,
      setShippingAddress,
      setShippingMethod,
      setBillingAddress
    } = useCheckout();
    const userAddressData = useUserAddressData();
    const loadingAddresses = ref(false);
    const addresses = computed(() =>
      userAddressData.getAddresses(shipping.value)
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
      phone: '',
      isSameAsBilling: false
    });

    const selectedMethod = computed(() => ({
      ...checkoutData?.shipping_method,
      id: checkoutData?.shipping_method?.id
    }));
    const selectShippingMethod = async (method) => {
      await setShippingMethod(method);
    };

    setShippingAddress({ isValid: false });

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
          setShippingAddress(
            loadedAddress
          );
        }
      }

      form.value = {
        first_name:
          checkoutData?.shipping_address?.first_name ||
          userAddressData.getFirstName(loadedAddress),
        last_name:
          checkoutData?.shipping_address?.last_name ||
          userAddressData.getLastName(loadedAddress),
        line_1:
          checkoutData?.shipping_address?.line_1 ||
          userAddressData.getLine1(loadedAddress),
        line_2:
          checkoutData?.shipping_address?.line_2 ||
          userAddressData.getLine2(loadedAddress),
        city:
          checkoutData?.shipping_address?.city ||
          userAddressData.getCity(loadedAddress),
        county:
          checkoutData?.shipping_address?.county ||
          userAddressData.getCounty(loadedAddress),
        country:
          checkoutData?.shipping_address?.country ||
          userAddressData.getCountry(loadedAddress),
        postcode:
          checkoutData?.shipping_address?.postcode ||
          userAddressData.getPostCode(loadedAddress),
        phone:
          checkoutData?.shipping_address?.phone ||
          userAddressData.getPhone(loadedAddress),
        isSameAsBilling:
          checkoutData?.shipping_address?.isSameAsBilling || false
      };
    };

    onMounted(async () => {
      await load();
      loadAddressIntoForm();
    });

    const billingCanBeSkipped = computed(() => form.value.isSameAsBilling);

    const handleFormSubmit = computed(() => async () => {
      await setShippingAddress({
        ...form.value,
        isValid: true
      });

      if (billingCanBeSkipped.value) {
        await setBillingAddress({
          ...(checkoutData?.shipping_address || {}),
          isValid: true
        });
        router.push(localePath('/checkout/payment'));
      } else {
        router.push(localePath('/checkout/billing'));
      }
    });

    return {
      isFormSubmitted,
      form,
      countries: AVAILABLE_COUNTRIES,
      handleFormSubmit,
      loading: loadingAddresses,
      addresses,
      billingCanBeSkipped,
      loadAddressIntoForm,
      selectShippingMethod,
      selectedMethod
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

.form {
  --button-width: 100%;
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
    --button-width: auto;
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
  &__action {
    @include for-desktop {
      flex: 0 0 100%;
      display: flex;
    }
  }
  &__action-button {
    margin-top: var(--spacer-base);
    &--secondary {
      @include for-desktop {
        order: -1;
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
      color: var(--c-white);
    }
    @include for-desktop {
      margin: 0 var(--spacer-xl) 0 0;
    }
  }
}

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

.title {
  margin: var(--spacer-xl) 0 var(--spacer-base) 0;
}
</style>

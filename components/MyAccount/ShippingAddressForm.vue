<template>
  <transition name="sf-fade">
    <ValidationObserver v-slot="{ handleSubmit }">
      <form class="form" @submit.prevent="handleSubmit(saveAddress)">
        <ValidationProvider
          name="name"
          rules="max:100"
          v-slot="{ errors }"
          slim
        >
          <SfInput
            v-model="form.name"
            name="name"
            :label="$t('Address Name')"
            class="form__element"
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider
          name="firstName"
          rules="required|max:100"
          v-slot="{ errors }"
          slim
        >
          <SfInput
            v-model="form.firstName"
            name="firstName"
            :label="$t('First name')"
            required
            class="form__element form__element--half"
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider
          name="lastName"
          rules="required|max:100"
          v-slot="{ errors }"
          slim
        >
          <SfInput
            v-model="form.lastName"
            name="lastName"
            :label="$t('Last name')"
            required
            class="form__element form__element--half form__element--half-even"
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider
          name="line1"
          rules="required|max:255"
          v-slot="{ errors }"
          slim
        >
          <SfInput
            v-model="form.line1"
            name="line1"
            :label="$t('Address line 1')"
            required
            class="form__element"
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider
          name="line_2"
          rules="max:255"
          v-slot="{ errors }"
          slim
        >
          <SfInput
            v-model="form.line2"
            name="line2"
            :label="$t('Address line 2')"
            class="form__element"
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
            v-model="form.city"
            name="city"
            :label="$t('City')"
            required
            class="form__element form__element--half"
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider
          name="county"
          slim
          rules="required|min:2|max:100"
          v-slot="{ errors }"
        >
          <SfInput
            v-model="form.county"
            name="county"
            :label="$t('County')"
            class="form__element form__element--half form__element--half-even"
            required
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider
          name="postcode"
          rules="required|max:30"
          v-slot="{ errors }"
          slim
        >
          <SfInput
            v-model="form.postcode"
            name="postcode"
            :label="$t('Post code')"
            required
            class="form__element form__element--half"
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
            v-model="form.country"
            name="country"
            :label="$t('Country')"
            required
            class="sf-select--underlined form__select form__element form__element--half form__element--half-even"
            data-testid="country"
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
          name="phone"
          rules="max:50"
          v-slot="{ errors }"
          slim
        >
          <SfInput
            v-model="form.phoneNumber"
            name="phone"
            :label="$t('Phone number')"
            class="form__element"
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          />
        </ValidationProvider>
        <SfButton class="action-button" type="submit" v-if="!isNew">{{
          $t('Update address')
        }}</SfButton>
        <SfButton class="action-button" type="submit" v-else>{{
          $t('Save address')
        }}</SfButton>
      </form>
    </ValidationObserver>
  </transition>
</template>

<script lang="ts">
import {
  SfIcon,
  SfInput,
  SfButton,
  SfSelect
} from '@storefront-ui/vue';
import { AVAILABLE_COUNTRIES } from '@/constants';
import { useUserAddressData } from '@/composables';
import type { Address } from '@vsf-enterprise/epcc-api';
import { defineComponent, ref } from '@nuxtjs/composition-api';
import { ValidationProvider, ValidationObserver } from 'vee-validate';

export default defineComponent({
  name: 'ShippingAddressForm',
  components: {
    SfInput,
    SfButton,
    SfSelect,
    SfIcon,
    ValidationProvider,
    ValidationObserver
  },
  props: {
    isNew: {
      type: Boolean,
      default: false
    },
    address: {
      type: Object as () => Address,
      required: true,
      default: () => ({})
    }
  },
  setup(props, { emit }) {
    const userAddressData = useUserAddressData();

    const form = ref({
      name: props.address.name ?? '',
      firstName: userAddressData.getFirstName(props.address),
      lastName: userAddressData.getLastName(props.address),
      line1: userAddressData.getLine1(props.address),
      line2: userAddressData.getLine2(props.address),
      city: userAddressData.getCity(props.address),
      county: userAddressData.getCounty(props.address),
      postcode: userAddressData.getPostCode(props.address),
      country: userAddressData.getCountry(props.address),
      phoneNumber: userAddressData.getPhone(props.address)
    });

    const saveAddress = () => {
      const shipping = {
        ...(props.address.id ? { id: props.address.id } : {}),
        name: form.value.name,
        first_name: form.value.firstName,
        last_name: form.value.lastName,
        line_1: form.value.line1,
        line_2: form.value.line2,
        city: form.value.city,
        county: form.value.county,
        postcode: form.value.postcode,
        country: form.value.country,
        phone_number: form.value.phoneNumber
      };
      emit('submit', {
        form: shipping,
        onComplete: console.log,
        onError: console.error
      });
    };

    return {
      countries: AVAILABLE_COUNTRIES,
      form,
      saveAddress
    };
  }
});
</script>

<style lang="scss" scoped>
@import '~@storefront-ui/vue/styles';

.shipping-list {
  margin: 0 0 var(--spacer-base) 0;
}
.shipping {
  display: flex;
  padding: var(--spacer-base) 0;
  border: 1px solid var(--c-light);
  border-width: 1px 0 0 0;
  &:last-child {
    border-width: 1px 0 1px 0;
  }
  &__content {
    flex: 1;
    color: var(--c-text);
  }
  &__actions {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    @include for-desktop {
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
    }
  }
  &__button-delete {
    --button-background: var(--c-light);
    --button-color: var(--c-dark-variant);
    &:hover {
      --button-background: var(--_c-light-primary);
    }
    @include for-desktop {
      margin: 0 0 0 var(--spacer-base);
    }
  }
  &__address {
    margin: 0 0 var(--spacer-base) 0;
    &:last-child {
      margin: 0;
    }
  }
}
.tab-orphan {
  @include for-mobile {
    --tabs-content-border-width: 0;
    --tabs-title-display: none;
    --tabs-content-padding: 0;
  }
}
.form {
  @include for-desktop {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }
  &__element {
    margin: 0 0 var(--spacer-base) 0;
    @include for-desktop {
      flex: 0 0 100%;
    }
    &--half {
      @include for-desktop {
        flex: 1 1 50%;
      }
      &-even {
        @include for-desktop {
          padding: 0 0 0 var(--spacer-lg);
        }
      }
    }
  }
  &__select {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    flex-wrap: wrap;
    ::v-deep .sf-select__dropdown {
      font-size: var(--font-size--lg);
      margin: 0 0 var(--spacer-xs) 0;
      color: var(--c-text);
      font-family: var(--font-family--secondary);
      font-weight: var(--font-weight--normal);
    }
    ::v-deep .sf-select__label {
      @include for-desktop {
        left: var(--spacer-lg);
      }
    }
  }
}
.message {
  margin: 0 0 var(--spacer-base) 0;
}
.action-button {
  --button-width: 100%;
  @include for-desktop {
    --button-width: auto;
  }
}
.sf-component-select {
  &.is-invalid {
    --component-select-label-color: var(--c-danger);
  }
}
</style>

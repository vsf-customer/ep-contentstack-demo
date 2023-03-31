<template>
  <div id="thank-you">
    <SfCallToAction
      v-e2e="'thank-you-banner'"
      class="banner"
      :title="$t('Thank you for your order!')"
      :image="{
        mobile: '/thankyou/bannerM.png',
        desktop: '/thankyou/bannerD.png'
      }"
    >
      <template #description>
        <div class="banner__order-number">
          <span>{{ $t('Order No.') }}</span>&nbsp;
          <strong>{{ orderNumber }}</strong>
        </div>
      </template>
    </SfCallToAction>
    <div class="confirmation">
      {{
        $t(
          'Thank you for your purchase, your order has been placed, if you have any questions regarding your order please contact the customer care team.'
        )
      }}
    </div>
    <div class="order">
      <div class="order__contact">
        <div class="user">
          <p>
            <strong>{{ $t('Name:') }}</strong>
            <span>{{ customer.name }}</span>
          </p>
          <p>
            <strong>{{ $t('Email:') }}</strong>
            <span>{{ customer.email }}</span>
          </p>
        </div>
        <div class="shipping-address">
          <p>
            <strong>{{ $t('Shipping Address:') }}</strong>
          </p>
          <p>
            {{ shippingAddress.first_name }} {{ shippingAddress.last_name }}
          </p>
          <p>{{ shippingAddress.line1 }} {{ shippingAddress.line2 }}</p>
          <p>{{ shippingAddress.company_name }}</p>
          <p>
            {{ shippingAddress.city }}, {{ shippingAddress.county }},
            {{ shippingAddress.country }}
          </p>
          <p>{{ shippingAddress.postcode }}</p>
          <p>{{ shippingAddress.phone_number }}</p>
          <p>{{ shippingAddress.instructions }}</p>
        </div>
        <div class="billing-address">
          <p>
            <strong>{{ $t('Billing Address:') }}</strong>
          </p>
          <p>{{ billingAddress.first_name }} {{ billingAddress.last_name }}</p>
          <p>{{ billingAddress.line1 }} {{ billingAddress.line2 }}</p>
          <p>{{ billingAddress.company_name }}</p>
          <p>
            {{ billingAddress.city }}, {{ billingAddress.county }},
            {{ billingAddress.country }}
          </p>
          <p>{{ billingAddress.postcode }}</p>
        </div>
      </div>

      <div class="order__items">
        <OrderProducts :order="order" />
      </div>

      <div class="order-summary__totals">
        <SfProperty
          v-if="discount"
          :name="$t('Discount')"
          :value="discount"
          class="sf-property--full-width sf-property--large sf-order-summary__property"
        />
        <SfProperty
          v-if="orderTax"
          :name="$t('Tax')"
          :value="orderData.getValueFormatted(orderTax, order)"
          class="sf-property--full-width sf-property--large sf-order-summary__property"
        />
        <SfDivider class="sf-order-summary__divider" />
        <SfProperty
          :name="$t('Total price')"
          :value="totals"
          class="sf-property--full-width sf-property--large sf-order-summary__property"
        />
      </div>
    </div>

    <SfLink link="/" class="back-to-shopping">{{
      $t('Go back to shop')
    }}</SfLink>
  </div>
</template>

<script>
import {
  SfHeading,
  SfLink,
  SfProperty,
  SfDivider,
  SfCallToAction
} from '@storefront-ui/vue';
import OrderProducts from '../../components/OrderProducts.vue';

import {
  defineComponent,
  onBeforeMount,
  useContext,
  useRoute,
  useRouter,
  ref
} from '@nuxtjs/composition-api';
import { useMakeOrder } from '@/composables';
import { useOrderData } from '../../composables/useOrderData';

export default defineComponent({
  components: {
    SfHeading,
    SfLink,
    SfCallToAction,
    OrderProducts,
    SfProperty,
    SfDivider
  },
  setup() {
    const { localePath } = useContext();
    const route = useRoute();
    const router = useRouter();
    const { order } = useMakeOrder();
    const orderData = useOrderData();
    const { query } = route.value;
    const orderNumber = query?.order;

    const shippingAddress =
      ref(orderData.getShippingAddress(order.value)) || {};
    const billingAddress = ref(orderData.getBillingAddress(order.value)) || {};
    const totals = ref(orderData.getOrderTotalsFormatted(order.value));
    const discount = ref(orderData.getOrderDiscountFormatted(order.value));
    const customer = ref(orderData.getCustomer(order.value));
    const orderTax = ref(orderData.getOrderTax(order.value));

    onBeforeMount(() => {
      if (!order?.value) {
        router.push(localePath('/'));
      }
    });

    return {
      order:
        !orderNumber || order.value?.id === orderNumber ? order : undefined,
      orderNumber,
      shippingAddress,
      billingAddress,
      totals,
      discount,
      customer,
      orderTax,
      orderData
    };
  }
});
</script>

<style lang="scss">
.sf-table__row:hover {
  @include for-desktop {
    --table-row-box-shadow: 0;
  }
}
</style>

<style lang="scss" scoped>
#thank-you {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1272px;
    padding: 0 var(--spacer-sm);
    margin: 0 auto;
  }
}

.banner {
  --call-to-action-color: var(--c-text);
  --call-to-action-title-font-size: var(--h2-font-size);
  --call-to-action-title-font-weight: var(--font-weight--semibold);
  --call-to-action-text-container-width: 50%;
  &__order-number {
    display: flex;
    flex-direction: column;
    font: var(--font-weight--light) var(--font-size--sm) / 1.4
      var(--font-family--primary);
    @include for-desktop {
      flex-direction: row;
      font-size: var(--font-size--normal);
    }
  }
}
.confirmation {
  padding: var(--spacer-xl);
  @include for-desktop {
    padding: var(--spacer-xl) var(--spacer-2xl);
  }
  @include for-mobile {
    padding: var(--spacer-sm) var(--spacer-lg);
  }
}
.order {
  background: var(--c-light);
  padding-bottom: var(--spacer-sm);
  @include for-desktop {
    padding: var(--spacer-xl) var(--spacer-xl) var(--spacer-2xl)
      var(--spacer-2xl);
  }
  @include for-mobile {
    padding: var(--spacer-sm) var(--spacer-lg);
  }
  &__heading {
    --heading-title-font-weight: var(--font-weight--bold);
    @include for-desktop {
      --heading-title-color: var(--c-link);
      --heading-title-font-weight: var(--font-weight--swemibold);
    }
  }
  &__heading,
  &__paragraph,
  &__notifications-button {
    --button-width: calc(100% - var(--spacer-lg));
    margin: 0 auto;
    @include for-desktop {
      margin: var(--spacer-xl) 0 0 0;
    }
  }
}
.order__contact {
  color: var(--c-dark-variant);
  font: var(--font-weight--light) var(--font-size--base) / 1.6
    var(--font-family--secondary);
  @include for-desktop {
    font-weight: var(--font-weight--normal);
    font-size: var(--font-size--sm);
  }
  &__name,
  &__street,
  &__city {
    margin: 0;
  }
  &__email {
    margin: var(--spacer-sm) 0 0 0;
    @include for-desktop {
      margin-bottom: var(--spacer-sm);
    }
  }
  &__name,
  &__street,
  &__city,
  &__email {
    font-size: var(--font-size--sm);
  }
}

.back-to-shopping {
  text-align: center;
  display: block;
  width: 100%;
  margin: 0 auto var(--spacer-sm) auto;
  @include for-desktop {
    margin: var(--spacer-xl) auto;
  }
}
.button-size {
  @include for-desktop {
    --button-width: 25rem;
  }
}
</style>

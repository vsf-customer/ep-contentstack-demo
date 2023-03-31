<template>
  <SfTabs :open-tab="1">
    <SfTab :title="$t('My orders')">
      <div v-if="currentOrder">
        <SfButton
          class="sf-button--text all-orders"
          @click="currentOrder = null"
          >{{ $t('All Orders') }}</SfButton
        >
        <div class="highlighted highlighted--total">
          <SfProperty
            :name="$t('Order ID')"
            :value="getId(currentOrder)"
            class="sf-property--full-width property"
          />
          <SfProperty
            :name="$t('Date')"
            :value="getDate(currentOrder)"
            class="sf-property--full-width property"
          />
          <SfProperty
            :name="$t('Status')"
            :value="getStatus(currentOrder)"
            class="sf-property--full-width property"
          />
          <SfProperty
            v-if="currentOrderTax"
            :name="$t('Tax')"
            :value="getValueFormatted(currentOrderTax, currentOrder)"
            class="sf-property--full-width property"
          />
          <SfProperty
            :name="$t('Total')"
            :value="getPriceFormatted(currentOrder)"
            class="sf-property--full-width property"
          />
        </div>
        <SfTable class="products">
          <SfTableHeading>
            <SfTableHeader class="products__name">{{
              $t('Product')
            }}</SfTableHeader>
            <SfTableHeader>{{ $t('Quantity') }}</SfTableHeader>
            <SfTableHeader>{{ $t('Price') }}</SfTableHeader>
          </SfTableHeading>
          <SfTableRow
            v-for="(item, i) in getItems(currentOrder, orders)"
            :key="i"
          >
            <SfTableData class="products__name">
              <nuxt-link
                :to="'/p/' + getItemProductId(item) + '/' + getItemSku(item)"
              >
                {{ getItemName(item) }}
              </nuxt-link>
            </SfTableData>
            <SfTableData>{{ getItemQty(item) }}</SfTableData>
            <SfTableData>{{ getItemPriceFormatted(item) }}</SfTableData>
          </SfTableRow>
        </SfTable>
      </div>
      <div v-else>
        <p class="message">
          {{ $t('Details and status orders') }}
        </p>
        <div
          v-if="orders && orders.data && orders.data.length === 0"
          class="no-orders"
        >
          <p class="no-orders__title">
            {{ $t('You currently have no orders') }}
          </p>
          <SfButton
            class="no-orders__button"
            @click="$router.push(localePath('/'))">
            {{ $t('Start shopping') }}
          </SfButton>
        </div>
        <SfTable v-else class="orders">
          <SfTableHeading>
            <SfTableHeader
              v-for="tableHeader in tableHeaders"
              :key="tableHeader"
              >{{ $t(tableHeader) }}</SfTableHeader
            >
            <SfTableHeader class="orders__element--right">
              <span class="smartphone-only">{{ $t('Download') }}</span>
              <SfButton
                class="desktop-only sf-button--text orders__download-all"
                @click="downloadOrders()"
              >
                {{ $t('Download all') }}
              </SfButton>
            </SfTableHeader>
          </SfTableHeading>
          <SfTableRow v-for="order in orders.data" :key="getId(order)">
            <SfTableData>{{ getId(order) }}</SfTableData>
            <SfTableData>{{ getDate(order) }}</SfTableData>
            <SfTableData>{{ getPriceFormatted(order) }}</SfTableData>
            <SfTableData>
              <span :class="getStatusTextClass(order)">{{
                getStatus(order)
              }}</span>
            </SfTableData>
            <SfTableData class="orders__view orders__element--right">
              <SfButton
                class="sf-button--text smartphone-only"
                @click="downloadOrder(order)"
              >
                {{ $t('Download') }}
              </SfButton>
              <SfButton
                class="sf-button--text desktop-only"
                @click="currentOrder = order"
              >
                {{ $t('View details') }}
              </SfButton>
            </SfTableData>
          </SfTableRow>
        </SfTable>
        <p>{{ $t('Total orders - ') }}{{ getOrdersTotal(orders) }}</p>
      </div>
    </SfTab>
  </SfTabs>
</template>

<script lang="ts">
import { SfTabs, SfTable, SfButton, SfProperty } from '@storefront-ui/vue';
import { defineComponent, ref, useFetch, computed } from '@nuxtjs/composition-api';
import { useUserOrder } from '@/composables';
import { Order } from '@vsf-enterprise/epcc-api';
import { AgnosticOrderStatus } from '@vue-storefront/core';
import { useOrderData } from '../../composables/useOrderData';

export default defineComponent({
  name: 'PersonalDetails',
  components: {
    SfTabs,
    SfTable,
    SfButton,
    SfProperty
  },
  setup() {
    const {
      getDate,
      getPriceFormatted,
      getValueFormatted,
      getId,
      getStatus,
      getItems,
      getItemProductId,
      getItemSku,
      getItemName,
      getItemQty,
      getItemPriceFormatted,
      getOrdersTotal,
      getOrderTax
    } = useOrderData();
    const { orders, search } = useUserOrder();
    const currentOrder = ref<Order>(null);
    const currentOrderTax = computed(() => getOrderTax(currentOrder.value));

    const { fetchState } = useFetch(async () => {
      await search({ with: 'items' });
    });

    const tableHeaders = ['Order ID', 'Payment date', 'Amount', 'Status'];

    const getStatusTextClass = (order: Order) => {
      const status = getStatus(order);
      switch (status) {
        case AgnosticOrderStatus.Open:
          return 'text-warning';
        case AgnosticOrderStatus.Complete:
          return 'text-success';
        default:
          return '';
      }
    };

    const downloadFile = (file, name) => {
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');

      const url = window.URL.createObjectURL(file);
      a.href = url;
      a.download = name;
      a.click();
      window.URL.revokeObjectURL(url);
    };

    const downloadOrders = async () => {
      downloadFile(
        new Blob([JSON.stringify(orders.value)], { type: 'application/json' }),
        'orders.json'
      );
    };

    const downloadOrder = async (order: Order) => {
      downloadFile(
        new Blob([JSON.stringify(order)], { type: 'application/json' }),
        'order ' + getId(order) + '.json'
      );
    };

    return {
      tableHeaders,
      orders,
      getStatusTextClass,
      downloadOrder,
      downloadOrders,
      currentOrder,
      fetchState,
      getDate,
      getPriceFormatted,
      getId,
      getStatus,
      getItems,
      getItemProductId,
      getItemSku,
      getItemName,
      getItemQty,
      getItemPriceFormatted,
      getOrdersTotal,
      getValueFormatted,
      currentOrderTax
    };
  }
});
</script>

<style lang="scss" scoped>
.no-orders {
  &__title {
    margin: 0 0 var(--spacer-lg) 0;
    font: var(--font-weight--normal) var(--font-size--base) / 1.6
      var(--font-family--primary);
  }
  &__button {
    --button-width: 100%;
    @include for-desktop {
      --button-width: 17, 5rem;
    }
  }
}
.orders {
  @include for-desktop {
    &__element {
      &--right {
        --table-column-flex: 0;
        text-align: right;
      }
    }
  }
}
.all-orders {
  --button-padding: var(--spacer-base) 0;
}
.message {
  margin: 0 0 var(--spacer-xl) 0;
  font: var(--font-weight--light) var(--font-size--base) / 1.6
    var(--font-family--primary);
}
.product {
  &__properties {
    margin: var(--spacer-xl) 0 0 0;
  }
  &__property,
  &__action {
    font-size: var(--font-size--sm);
  }
  &__action {
    color: var(--c-gray-variant);
    font-size: var(--font-size--sm);
    margin: 0 0 var(--spacer-sm) 0;
    &:last-child {
      margin: 0;
    }
  }
  &__qty {
    color: var(--c-text);
  }
}
.products {
  --table-column-flex: 1;
  &__name {
    margin-right: var(--spacer-sm);
    @include for-desktop {
      --table-column-flex: 2;
    }
  }
}
.highlighted {
  box-sizing: border-box;
  width: 100%;
  background-color: var(--c-light);
  padding: var(--spacer-sm);
  --property-value-font-size: var(--font-size--base);
  --property-name-font-size: var(--font-size--base);
  &:last-child {
    margin-bottom: 0;
  }
  ::v-deep .sf-property__name {
    white-space: nowrap;
  }
  ::v-deep .sf-property__value {
    text-align: right;
  }
  &--total {
    margin-bottom: var(--spacer-sm);
  }
  @include for-desktop {
    padding: var(--spacer-xl);
    --property-name-font-size: var(--font-size--lg);
    --property-name-font-weight: var(--font-weight--medium);
    --property-value-font-size: var(--font-size--lg);
    --property-value-font-weight: var(--font-weight--semibold);
  }
}
</style>

<template>
  <div class="sf-confirm-order">
    <SfTable class="sf-table--bordered sf-confirm-order__table">
      <SfTableHeading class="sf-confirm-order__table-row">
        <SfTableHeader
          v-for="tableHeader in tableHeaders"
          :key="tableHeader"
          class="sf-confirm-order__table-header"
          >{{ $t(tableHeader) }}
        </SfTableHeader>
      </SfTableHeading>
      <SfTableRow
        v-for="(item, index) in items"
        :key="index"
        class="sf-confirm-order__table-row"
        data-testid="item-table-row"
      >
        <SfTableData
          class="sf-confirm-order__table-data"
          data-testid="product-description-table-data"
        >
          <div class="sf-confirm-order__product-title">
            {{ orderData.getItemName(item) }}
          </div>
          <div class="sf-confirm-order__product-sku">
            {{ $t('SKU') }}: {{ orderData.getItemSku(item) }}
          </div>

          <div
            class="bundle-components"
            v-if="item.components && Object.keys(item.components).length"
          >
            <p>{{ $t('Single quantity contains') }}:</p>
            <ul>
              <li v-for="component in item.components" :key="component.name">
                {{ component.name }} - ({{ component.options[0].quantity }})
              </li>
            </ul>
          </div>
        </SfTableData>
        <SfTableData class="sf-confirm-order__table-data">{{
          orderData.getItemQty(item)
        }}</SfTableData>
        <SfTableData class="sf-confirm-order__table-data">
          <SfPrice
            :regular="orderData.getItemUnitPriceFormatted(item)"
            class="order-products__unit-price"
          />
        </SfTableData>
        <SfTableData class="sf-confirm-order__table-data">
          <SfPrice
            :regular="orderData.getItemPriceFormatted(item)"
            class="sf-confirm-order__product-price"
          />
        </SfTableData>
      </SfTableRow>
    </SfTable>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api';
import { SfTable, SfDivider, SfPrice, SfProperty } from '@storefront-ui/vue';
import { useOrderData } from '@/composables/useOrderData';
import { Order, OrderItem } from '@vsf-enterprise/epcc-api';

export default defineComponent({
  name: 'OrderProducts',

  components: {
    SfTable,
    SfDivider,
    SfPrice,
    SfProperty
  },

  props: {
    order: {
      type: Object as () => Order & { items?: OrderItem[] },
      required: true
    }
  },

  setup(props) {
    const orderData = useOrderData();
    const filteredOrderItems =
      props.order?.items?.filter((item) => item.unit_price.amount >= 0) ?? [];
    const sortedFilteredOrderItems = filteredOrderItems.sort((a, b) =>
      b.product_id.localeCompare(a.product_id)
    );
    const items = computed(() => {
      return sortedFilteredOrderItems;
    });

    return {
      items,
      orderData,
      tableHeaders: ['Item Description', 'Quantity', 'Unit price', 'Amount']
    };
  }
});
</script>

<style lang="scss" scoped>
@import '~@storefront-ui/shared/styles/components/templates/SfConfirmOrder.scss';
.sf-confirm-order__table {
  @include for-mobile {
    width: calc(var(--table-width, 100%) - var(--spacer-sm) * 2);
  }
}

.order-products {
  &__unit-price {
    --price-regular-font-size: var(--font-size--base);
    --price-regular-font-weight: var(--font-weight--normal);
  }
}
</style>

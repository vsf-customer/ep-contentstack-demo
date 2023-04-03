<template>
  <SfFooter :column="4" multiple class="footer">
    <SfFooterColumn
      v-for="(column, i) of footer.items"
      :key="i"
      :title="column.heading"
    >
      <SfList>
        <SfListItem v-for="(item, ii) in column.items" :key="ii">
          <SfMenuItem :label="item.caption" :link="item.link" />
        </SfListItem>
      </SfList>
    </SfFooterColumn>
  </SfFooter>
</template>

<script lang="ts">
import { SfFooter, SfList, SfMenuItem } from '@storefront-ui/vue';
import useCmsLayout from '../composables/useCmsLayout';

export default {
  name: 'Footer',
  components: {
    SfFooter,
    SfList,
    SfMenuItem
  },
  setup() {
    const { footer } = useCmsLayout();

    return {
      footer
    };
  }
};
</script>

<style lang="scss">
.footer {
  margin-bottom: 3.75rem;
  @include for-desktop {
    margin-bottom: 0;
  }
}
.sf-footer {
  @include for-desktop {
    border-top: var(--spacer-xs) solid var(--c-primary);
    padding-bottom: 0;
    margin-top: var(--spacer-2xl);
  }
  &__container {
    margin: var(--spacer-sm);
    @include for-desktop {
      max-width: 69rem;
      margin: 0 auto;
    }
  }
}
</style>

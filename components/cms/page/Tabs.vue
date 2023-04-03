<template>
  <SfTabs>
    <SfTab v-for="(item, i) in items" :key="i" :title="item.title">
      <RenderContent :content="item.content" />
    </SfTab>
  </SfTabs>
</template>

<script lang="ts">
import Vue from 'vue'
import { SfTabs } from '@storefront-ui/vue'

export default Vue.extend({
  name: 'Tabs',
  components: {
    SfTabs,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
})
</script>

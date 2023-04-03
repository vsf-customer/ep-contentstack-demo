<template>
  <SfSteps :steps="items" :can-go-back="true">
    <SfStep v-for="(item, i) in items" :key="i" :name="item.title">
      <RenderContent :content="item.content" />
    </SfStep>
  </SfSteps>
</template>

<script lang="ts">
import Vue from 'vue'
import { SfSteps } from '@storefront-ui/vue'

export default Vue.extend({
  name: 'Steps',
  components: {
    SfSteps,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
})
</script>

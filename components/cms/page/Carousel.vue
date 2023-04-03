<template>
  <SfCarousel>
    <SfCarouselItem v-for="(item, i) in items" :key="i">
      <RenderContent :content="item.content" />
    </SfCarouselItem>
  </SfCarousel>
</template>

<script lang="ts">
import Vue from 'vue'
import { SfCarousel } from '@storefront-ui/vue'

export default Vue.extend({
  name: 'Carousel',
  components: {
    SfCarousel,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
})
</script>

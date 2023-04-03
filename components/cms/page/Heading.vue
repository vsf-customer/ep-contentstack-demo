<template>
  <SfHeading :title="title" :description="description" :level="Number(level)" />
</template>

<script lang="ts">
import Vue from 'vue'
import { SfHeading } from '@storefront-ui/vue'

export default Vue.extend({
  name: 'Heading',
  components: {
    SfHeading,
  },
  props: {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    level: {
      type: [Number, String],
    },
  },
})
</script>

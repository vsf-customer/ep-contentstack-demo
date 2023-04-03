<template>
  <RenderContent :content="content" />
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Page',
  props: {
    content: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
    },
  },
  head() {
    return {
      title: this.title,
    }
  },
})
</script>

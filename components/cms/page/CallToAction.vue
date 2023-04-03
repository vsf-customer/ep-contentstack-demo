<template>
  <SfCallToAction
    :title="title"
    :description="description"
    :button-text="button_text"
    :link="button_link"
    :image="image.url"
    :background="background"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import { SfCallToAction } from '@storefront-ui/vue'

export default Vue.extend({
  name: 'CallToAction',
  components: {
    SfCallToAction,
  },
  props: {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    button_text: {
      type: String,
    },
    button_link: {
      type: String,
    },
    image: {
      type: Object,
    },
    background: {
      type: String,
    },
  },
})
</script>

<template>
  <SfGallery :images="galleryImages" />
</template>

<script lang="ts">
import Vue from 'vue'
import { SfGallery } from '@storefront-ui/vue'

export default Vue.extend({
  name: 'Gallery',
  components: {
    SfGallery,
  },
  props: {
    images: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    galleryImages() {
      return Array.isArray(this.images)
        ? this.images.map((image) => ({
            alt: image.alt || '',
            mobile: {
              url: image.url,
            },
            desktop: {
              url: image.url,
            },
            zoom: {
              url: image.url,
            },
          }))
        : []
    },
  },
})
</script>

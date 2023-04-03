<template>
  <SfBanner
    :title="title"
    :subtitle="subtitle"
    :description="description"
    :button-text="button_text"
    :link="button_link"
    :image="image ? image.url : ''"
    :class="class_name"
  >
    <template #call-to-action>
      <SfButton class="desktop-only" v-if="button_link">
        <nuxt-link :to="{ path: button_link }" class="text-light" style="pointer-events: auto;">
          {{ button_text }}
        </nuxt-link>
      </SfButton>
    </template>
  </SfBanner>
</template>

<script lang="ts">
import Vue from 'vue'
import { SfBanner, SfButton } from '@storefront-ui/vue'

export default Vue.extend({
  name: 'Banner',
  components: {
    SfBanner,
    SfButton,
  },
  props: {
    title: {
      type: String,
    },
    subtitle: {
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
    class_name: {
      type: String,
    },
  },
})
</script>
<style scoped>
.full-width{
  width: 100vw !important;
  left: 50%;
  transform: translateX(-50%);
  position: relative;
      height: 36vw;
}



@media screen and (max-width: 400px) {
  ::v-deep .sf-banner__title{
    font-size: 40px;
    font-weight: bold;
  }

}
</style>
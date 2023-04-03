<template>
  <SfHero>
    <SfHeroItem
      v-for="(item, i) in items"
      :key="i"
      :title="item.title"
      :subtitle="item.subtitle"
      :background="item.background"
      :image="item.image ? item.image.url : ''"
      :button-text="item.button_text"
    >
      <template #call-to-action>
        <SfButton class="desktop-only" v-if="item.button_text">
          <nuxt-link :to="{ path: item.button_link }" class="text-light">
            {{ item.button_text }}
          </nuxt-link>
        </SfButton>
      </template>
    </SfHeroItem>
  </SfHero>
</template>

<script>
import Vue from 'vue'
import { SfHero, SfButton } from '@storefront-ui/vue'

export default Vue.extend({
  name: 'Hero',
  components: {
    SfHero,
    SfButton,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
})
</script>

<style lang="scss">
.sf-hero-item__wrapper {
  z-index: 2;
}
</style>

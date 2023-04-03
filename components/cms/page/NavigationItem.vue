<template>
  <SfHeaderNavigationItem
    class="nav-item"
    :label="caption"
    :link="link"
    @click.native="navigate"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import { SfMenuItem } from '@storefront-ui/vue';
import { useUiState } from '~/composables';

export default Vue.extend({
  name: 'Navigation',
  components: { SfMenuItem },
  props: {
    caption: {
      type: String,
    },
    link: {
      type: String,
    },
  },
  setup(props, { root }) {
    const { toggleMobileMenu, isMobileMenuOpen } = useUiState();
    const navigate = () => {
      if (!isMobileMenuOpen.value) return
      root.$router.push(props.link);
      toggleMobileMenu();
    }
    return { toggleMobileMenu, navigate };
  }
})
</script>

<template>
  <div id="home"> </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api';

export default defineComponent({
  name: 'Home',
  beforeRouteEnter: (_to, _from, next) => {
    next('/home-page');
  },
  setup() {
    return {};
  }
});
</script>

<style lang="scss"> </style>

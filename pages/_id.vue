<template>
  <div
    v-if="content"
    class="dynamic-page"
  >
    <render-content :content="content" />
  </div>
</template>

<script>
import { useRoute } from '@nuxtjs/composition-api';
import { useContent } from '@vsf-enterprise/contentstack';
import { onSSR, useVSFContext } from '@vue-storefront/core';
import Vue from 'vue';

/*
 * This page is prepared for CMS dynamic content rendering.
 */
export default Vue.extend({
  name: 'CMSDynamicPage',
  setup (_props) {
    const route = useRoute();
    const { i18n: { locale } } = useVSFContext();
    const id = route.value.params.id;
    const { search, content } = useContent(id);
    onSSR(async () => {
      await search({
        url: id,
        locale,
        preview: route.value.query.preview
      });
    });
    return {
      content
    };
  }
});
</script>

<style lang="scss">
.dynamic-page .render-content {
  width: 100%;
  margin: 0 auto;
  margin-bottom: var(--spacer-xl);
}
</style>

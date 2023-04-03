<template>
  <div>
    <component
      v-for="(component, index) in components"
      :is="component.componentName"
      :key="index"
      v-bind="component.props"
      class="render-content"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { extractComponents } from '@vsf-enterprise/contentstack';

interface RenderContent {
  componentName: string
  props?: {}
}

export default Vue.extend({
  name: 'RenderContent',
  props: {
    content: {
      type: [Array, Object],
    },
  },
  computed: {
    components(): RenderContent[] {
      return extractComponents(this.content);
    },
  },
});
</script>

<template>
  <RenderContent :style="{ '--min-col-width': min_col_width }" :class="grid_type" :content="items" />
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Grid',
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    min_col_width: {
      type: String,
      default: '15rem',
    },
    grid_type: {
      type: String,
      default: 'flex-grid',
    },
  },
})
</script>

<style scoped lang="scss">
.grid {
  --min-col-width: 15rem;
  --grid-gap: 2rem;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(var(--min-col-width), 1fr));
  grid-gap: 2rem;

  & + .grid {
    margin-top: var(--grid-gap);
  }
}

.flex-grid {
  --min-col-width: 15rem;

  display: flex;
  flex-wrap: wrap;

  & > ::v-deep * {
    min-width: var(--min-col-width);
    width: auto;
  }
}
</style>

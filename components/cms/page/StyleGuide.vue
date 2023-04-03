<template>
  <style>
    :root {
      {{ color_primary && `--c-primary: ${color_primary};` }}
      {{ color_secondary && `--c-secondary: ${color_secondary};` }}
      {{ color_text && `--c-text: ${color_text};` }}

      {{ font_primary && `--font-family--primary: ${font_primary};` }}
      {{ font_secondary && `--font-family--secondary: ${font_secondary};` }}
    }

    .sf-button:not(.sf-button--pure):not(.sf-button--text) {
      {{ button_radius && `--button-border-radius: ${button_radius};` }}
    }
  </style>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'StyleGuide',
  props: {
    color_primary: {
      type: String,
    },
    color_secondary: {
      type: String,
    },
    color_text: {
      type: String,
    },
    font_primary: {
      type: String,
    },
    font_secondary: {
      type: String,
    },
    button_radius: {
      type: String,
    },
  },
})
</script>

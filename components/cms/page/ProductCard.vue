<template>
  <SfProductCard
    :title="title"
    :link="link"
    :regular-price="$n(price, 'currency')"
    :special-price="$n(special_price, 'currency')"
    :score-rating="rating"
    :max-rating="max_rating"
    :image="image.url"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import { SfProductCard } from '@storefront-ui/vue'

export default Vue.extend({
  name: 'ProductCard',
  components: {
    SfProductCard,
  },
  props: {
    title: {
      type: String,
    },
    link: {
      type: String,
    },
    price: {
      type: Number,
    },
    special_price: {
      type: Number,
    },
    rating: {
      type: Number,
    },
    max_rating: {
      type: Number,
    },
    image: {
      type: Object,
    },
  },
})
</script>

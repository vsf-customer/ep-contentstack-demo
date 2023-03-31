<template>
  <SfSection :title-heading="title" class="section">
    <SfLoader :class="{ loading }" :loading="loading">
      <SfCarousel
        :settings="{ gap: 16, breakpoints: { 1023: { peek: 0, perView: Math.min(products.length, 2) } } }"
        class="carousel"
      >
        <SfCarouselItem
          class="carousel__item"
          v-for="(product, i) in products"
          :key="i"
        >
          <SfProductCard
            :title="getName(product)"
            :image="getCoverImage(product)"
            :regular-price="getPrice(product).regular"
            :special-price="getPrice(product).special"
            :link="localePath(`/p/${getId(product)}/${getSlug(product)}`)"
            :imageWidth="216"
            :imageHeight="216"
            :is-in-wishlist="
              isEnabledWishlist ? isInWishlist({ product }) : false
            "
            :wishlist-icon="isEnabledWishlist ? 'heart' : false"
            :image-tag="getCoverImage(product) ? 'nuxt-img' : 'img'"
            @click:wishlist="toggleWishlistItem(product)"
          />
        </SfCarouselItem>
      </SfCarousel>
    </SfLoader>
  </SfSection>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  PropType,
  useContext,
  useRouter
} from '@nuxtjs/composition-api';
import {
  SfCarousel,
  SfProductCard,
  SfSection,
  SfLoader
} from '@storefront-ui/vue';
import { Product, Wishlist } from '@vsf-enterprise/epcc-api';
import { useWishlist, useProductData, useUser } from '@/composables';
import { useWishlistData } from '../composables/useWishlistData';

export default defineComponent({
  name: 'RelatedProducts',
  setup() {
    const { $config, localePath } = useContext();
    const router = useRouter();
    const { getName, getCoverImage, getPrice, getId, getSlug } =
      useProductData();
    const { isAuthenticated } = useUser();

    const {
      wishlist,
      addItem: addItemToWishlist,
      isInWishlist,
      removeItem: removeItemFromWishlist
    } = useWishlist();
    const wishlistData = useWishlistData();
    const { wishlistEnabled } = $config.theme;
    const isEnabledWishlist = computed(
      () =>
        (isAuthenticated.value && wishlistEnabled.authenticated) ||
        (!isAuthenticated.value && wishlistEnabled.guest)
    );
    const toggleWishlistItem = async (product) => {
      const isConfigurableProduct = Boolean(product?.attributes?.base_product);
      if (isConfigurableProduct) {
        const pathToPdp = localePath(
          `/p/${getId(product)}/${getSlug(product)}`
        );
        return router.push(pathToPdp);
      }

      const productInWishlist = isInWishlist({ product });

      if (productInWishlist) {
        const wishlistItem = wishlistData.getLineItemByProductId(
          wishlist.value.items as Wishlist,
          product
        );
        await removeItemFromWishlist({ wishlistItem });
      } else {
        await addItemToWishlist({ product });
      }
    };

    return {
      getName,
      getCoverImage,
      getPrice,
      getId,
      getSlug,
      isInWishlist,
      toggleWishlistItem: isEnabledWishlist.value
        ? toggleWishlistItem
        : () => {},
      isEnabledWishlist
    };
  },
  components: {
    SfCarousel,
    SfProductCard,
    SfSection,
    SfLoader
  },
  props: {
    title: String,
    products: {
      type: Array as PropType<Array<Product>>,
      default: () => []
    },
    loading: Boolean
  }
});
</script>

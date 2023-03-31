<template>
  <div>
    <SfMegaMenu
      :visible="isSearchOpen"
      :title="$t('Search results')"
      class="search"
    >
      <transition name="sf-fade" mode="out-in">
        <div
          v-if="products && products.length > 0"
          class="search__wrapper-results"
          key="results"
        >
          <SfMegaMenuColumn
            :title="$t('Categories')"
            class="sf-mega-menu-column--pined-content-on-mobile search__categories"
          >
            <template #title="{ title, changeActive }">
              <SfMenuItem :label="title" @click="changeActive(title)">
                <template #mobile-nav-icon> &#8203; </template>
              </SfMenuItem>
            </template>
            <SfList>
              <SfListItem v-for="(category, key) in categories" :key="key">
                <SfMenuItem
                  :label="categoryData.getName(category)"
                  :link="localePath(`/c/${categoryData.getSlug(category)}`)"
                >
                  <template #mobile-nav-icon> &#8203; </template>
                </SfMenuItem>
              </SfListItem>
            </SfList>
          </SfMegaMenuColumn>
          <SfMegaMenuColumn
            :title="$t('Product suggestions')"
            class="sf-mega-menu-column--pined-content-on-mobile search__results"
          >
            <template #title="{ title }">
              <SfMenuItem
                :label="title"
                class="sf-mega-menu-column__header search__header"
              >
                <template #mobile-nav-icon> &#8203; </template>
              </SfMenuItem>
            </template>
            <SfScrollable
              class="results--desktop desktop-only"
              show-text=""
              hide-text=""
            >
              <div class="results-listing">
                <SfProductCard
                  v-for="(product, index) in products"
                  :key="index"
                  class="result-card"
                  :regular-price="productData.getPrice(product).regular"
                  :special-price="productData.getPrice(product).special"
                  :image="productData.getCoverImage(product)"
                  :alt="productData.getName(product)"
                  :title="productData.getName(product)"
                  :link="
                    localePath(
                      `/p/${productData.getId(product)}/${productData.getSlug(
                        product
                      )}`
                    )
                  "
                  :imageWidth="216"
                  :imageHeight="216"
                  :is-in-wishlist="
                    isEnabledWishlist ? isInWishlist({ product }) : false
                  "
                  :wishlist-icon="isEnabledWishlist ? 'heart' : false"
                  @click:wishlist="toggleWishlistItem(product)"
                  :image-tag="
                    productData.getCoverImage(product) ? 'nuxt-img' : 'img'
                  "
                />
              </div>
            </SfScrollable>
            <div class="results--mobile smartphone-only">
              <SfProductCard
                v-for="(product, index) in products"
                :key="index"
                class="result-card"
                :regular-price="productData.getPrice(product).regular"
                :special-price="productData.getPrice(product).special"
                :image="productData.getCoverImage(product)"
                :alt="productData.getName(product)"
                :title="productData.getName(product)"
                :link="
                  localePath(
                    `/p/${productData.getId(product)}/${productData.getSlug(
                      product
                    )}`
                  )
                "
                :imageWidth="128"
                :imageHeight="128"
                :is-in-wishlist="
                  isEnabledWishlist ? isInWishlist({ product }) : false
                "
                :wishlist-icon="isEnabledWishlist ? 'heart' : false"
                @click:wishlist="toggleWishlistItem(product)"
                :image-tag="
                  productData.getCoverImage(product) ? 'nuxt-img' : 'img'
                "
              />
            </div>
          </SfMegaMenuColumn>
          <div class="action-buttons smartphone-only">
            <SfButton
              class="action-buttons__button color-light"
              @click="$emit('close')"
              >{{ $t('Cancel') }}</SfButton
            >
          </div>
        </div>
        <div v-else key="no-results" class="before-results">
          <SfImage
            src="/error/error.svg"
            class="before-results__picture"
            alt="error"
            loading="lazy"
            :height="300"
            :width="300"
            image-tag="nuxt-img"
          />
          <p class="before-results__paragraph">
            {{ $t('You haven’t searched for items yet') }}
          </p>
          <p class="before-results__paragraph">
            {{ $t('Let’s start now – we’ll help you') }}
          </p>
          <SfButton
            class="before-results__button color-secondary smartphone-only"
            @click="$emit('close')"
            >{{ $t('Go back') }}</SfButton
          >
        </div>
      </transition>
    </SfMegaMenu>
  </div>
</template>

<script lang="ts">
import {
  SfMegaMenu,
  SfList,
  SfBanner,
  SfProductCard,
  SfScrollable,
  SfMenuItem,
  SfButton,
  SfImage
} from '@storefront-ui/vue';
import {
  ref,
  watch,
  computed,
  defineComponent,
  useContext,
  useRouter
} from '@nuxtjs/composition-api';
import { FacetSearchResult } from '@vue-storefront/core';
import { Facet, Wishlist } from '@vsf-enterprise/epcc-api';
import {
  useUser,
  useWishlist,
  useProductData,
  useCategoryData
} from '@/composables';
import { useWishlistData } from '@/composables/useWishlistData';

export default defineComponent({
  name: 'SearchResults',
  components: {
    SfMegaMenu,
    SfList,
    SfBanner,
    SfProductCard,
    SfScrollable,
    SfMenuItem,
    SfButton,
    SfImage
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    result: {
      type: Object as () => FacetSearchResult<Facet>
    }
  },
  setup(props) {
    const { $config, localePath } = useContext();
    const router = useRouter();
    const categoryData = useCategoryData();
    const productData = useProductData();
    const wishlistData = useWishlistData();
    const isSearchOpen = ref(props.visible);
    const products = computed(() => props.result?.data?.products);
    const categories = computed(() => props.result?.data?.categories);

    const { isAuthenticated } = useUser();
    const {
      wishlist,
      addItem: addItemToWishlist,
      isInWishlist,
      removeItem: removeItemFromWishlist
    } = useWishlist();

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
          `/p/${productData.getId(product)}/${productData.getSlug(product)}`
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

    watch(
      () => props.visible,
      (newVal) => {
        isSearchOpen.value = newVal;
        if (isSearchOpen.value) {
          document.body.classList.add('no-scroll');
        } else {
          document.body.classList.remove('no-scroll');
        }
      }
    );

    return {
      isSearchOpen,
      productData,
      products,
      categoryData,
      categories,
      isEnabledWishlist,
      isInWishlist,
      toggleWishlistItem
    };
  }
});
</script>

<style lang="scss" scoped>
.search {
  position: absolute;
  right: 0;
  left: 0;
  z-index: 3;
  --mega-menu-column-header-margin: var(--spacer-sm) 0 var(--spacer-xl);
  --mega-menu-content-padding: 0;
  --mega-menu-height: auto;
  @include for-desktop {
    --mega-menu-content-padding: var(--spacer-xl) 0;
  }
  &__wrapper-results {
    display: flex;
    flex-direction: column;
    @include for-desktop {
      flex-direction: row;
      flex: 1;
    }
  }
  &__categories {
    flex: 0 0 220px;
  }
  &__results {
    flex: 1;
  }
  &__header {
    margin-left: var(--spacer-sm);
  }
  ::v-deep .sf-bar {
    display: none;
  }
  ::v-deep .sf-mega-menu-column__header {
    display: none;
    @include for-desktop {
      display: flex;
    }
  }
}
.results {
  &--desktop {
    --scrollable-max-height: 35vh;
  }
  &--mobile {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    background: var(--c-white);
    padding: var(--spacer-base) var(--spacer-sm);
    --product-card-max-width: 9rem;
  }
}
.see-all {
  padding: var(--spacer-xl) 0 0 var(--spacer-sm);
}
.action-buttons {
  padding: var(--spacer-xl) var(--spacer-sm) var(--spacer-3xl);
  background: var(--c-white);
  width: 100%;
  &__button {
    width: calc(100% - 32px);
  }
}
.results-listing {
  display: flex;
  flex-wrap: wrap;
  margin-left: var(--spacer-2xs);
}
.result-card {
  margin: var(--spacer-sm) 0;
  @include for-desktop {
    margin: var(--spacer-2xs) 0;
  }
}

.before-results {
  box-sizing: border-box;
  padding: var(--spacer-base) var(--spacer-sm) var(--spacer-2xl);
  width: 100%;
  text-align: center;
  @include for-desktop {
    padding: 0;
  }
  &__picture {
    --image-width: 230px;
    margin-top: var(--spacer-2xl);
    @include for-desktop {
      --image-width: 18.75rem;
      margin-top: var(--spacer-base);
    }
  }
  &__paragraph {
    font-family: var(--font-family--primary);
    font-weight: var(--font-weight--normal);
    font-size: var(--font-size--base);
    color: var(--c-text-muted);
    margin: 0;
    @include for-desktop {
      font-size: var(--font-size--lg);
    }
    &:first-of-type {
      margin: var(--spacer-xl) auto var(--spacer-xs);
    }
  }
  &__button {
    margin: var(--spacer-xl) auto;
    width: 100%;
  }
}
</style>

<template>
  <div id="wishlist">
    <SfSidebar
      :visible="isWishlistSidebarOpen"
      :button="false"
      :title="$t('My wishlist')"
      @close="toggleWishlistSidebar"
      class="sidebar sf-sidebar--right"
    >
      <template #title>
        <div class="heading__wrapper">
          <SfHeading
            :level="3"
            :title="$t('My wishlist')"
            class="sf-heading--left"
          />
          <SfButton
            class="heading__close-button sf-button--pure"
            aria-label="Wishlist sidebar close button"
            @click="toggleWishlistSidebar"
          >
            <SfIcon icon="cross" size="14px" color="gray-primary" />
          </SfButton>
        </div>
      </template>
      <template #content-top>
        <!-- TODO: This is just an example for wishlist clearing feature, revisit its styling if it can stay somewhere here -->
        <SfButton @click="clear" class="clear-wishlist" v-if="totalItems">
          {{ $t('Clear wishlist') }}
        </SfButton>

        <div class="my-wishlist__total-items" v-if="totalItems">
          {{ $t('Total items') }}: <strong>{{ totalItems }}</strong>
        </div>
      </template>
      <transition name="fade" mode="out-in">
        <div v-if="totalItems" class="my-wishlist" key="my-wishlist">
          <div class="collected-product-list">
            <transition-group name="fade" tag="div">
              <SfCollectedProduct
                v-for="product in wishlistCartProducts"
                :key="wishlistData.getItemSku(product)"
                :image="wishlistData.getItemImage(product, true)"
                :title="wishlistData.getItemName(product)"
                :regular-price="
                  wishlistData.getItemPriceFormatted(product, true).regular
                "
                :special-price="
                  wishlistData.getItemPriceFormatted(product, true).special
                "
                :stock="99999"
                :image-width="180"
                :image-height="200"
                @click:remove="removeItem({ wishlistItem: { id: product.id } })"
                class="collected-product"
                :has-more-actions="false"
              >
                <template #configuration>
                  <div class="collected-product__properties" />
                </template>
                <template #input="{}">&nbsp;</template>
                <template #actions>
                  <span
                    v-if="
                      isInCart({
                        // product: { id: product.sku.replace('wishlist_', '') }
                      })
                    "
                  >
                    {{ $t('This item is in your cart') }}
                  </span>
                  <SfButton
                    v-else
                    class="sf-button--text"
                    @click="addToCart(product)"
                  >
                    {{ $t('Add to cart') }}
                  </SfButton>
                </template>
              </SfCollectedProduct>
            </transition-group>
          </div>
          <div class="sidebar-bottom">
            <SfProperty
              class="sf-property--full-width my-wishlist__total-price"
            >
              <template #name>
                <span class="my-wishlist__total-price-label">
                  {{ $t('Total price') }}:
                </span>
              </template>
              <template #value>
                <SfPrice :regular="totals.subtotal" />
              </template>
            </SfProperty>
          </div>
        </div>
        <div v-else class="empty-wishlist" key="empty-wishlist">
          <div class="empty-wishlist__banner">
            <SfImage
              src="/icons/empty-cart.svg"
              :alt="$t('Empty bag')"
              class="empty-wishlist__icon"
              :width="256"
              :height="173"
              image-tag="nuxt-img"
            />
            <SfHeading
              :title="$t('Your bag is empty')"
              :description="
                $t(
                  'Looks like you haven’t added any items to the bag yet. Start shopping to fill it in.'
                )
              "
              class="empty-wishlist__label"
            />
          </div>
        </div>
      </transition>
      <template #content-bottom>
        <SfButton
          @click="toggleWishlistSidebar"
          class="sf-button--full-width color-secondary"
        >
          {{ $t('Start shopping') }}
        </SfButton>
      </template>
    </SfSidebar>
  </div>
</template>

<script>
import {
  SfSidebar,
  SfHeading,
  SfButton,
  SfIcon,
  SfProperty,
  SfPrice,
  SfCollectedProduct,
  SfImage
} from '@storefront-ui/vue';
import { computed, defineComponent, useContext } from '@nuxtjs/composition-api';
import { useWishlistData } from '@/composables/useWishlistData';
import {
  useCart,
  useUser,
  useUiState,
  useWishlist,
  useProductData,
  useUiNotification
} from '@/composables';

export default defineComponent({
  name: 'Wishlist',
  components: {
    SfSidebar,
    SfButton,
    SfHeading,
    SfIcon,
    SfProperty,
    SfPrice,
    SfCollectedProduct,
    SfImage
  },
  setup() {
    const { $config } = useContext();
    const { isWishlistSidebarOpen, toggleWishlistSidebar } = useUiState();
    const wishlistData = useWishlistData();
    const { wishlist, removeItem, clear } = useWishlist();
    const {
      addItem: addItemToCart,
      isInCart,
      error: addToCartError
    } = useCart();
    const { isAuthenticated } = useUser();
    const productData = useProductData();
    const { send } = useUiNotification();

    const wishlistCartProducts = computed(() =>
      wishlistData.getItems(wishlist?.value?.items)
    );
    const totals = computed(() =>
      wishlistData.getTotalsFormatted(wishlist?.value?.items)
    );
    const totalItems = computed(() =>
      wishlistData.getTotalItems(wishlist?.value?.items)
    );
    const addToCart = async (product) => {
      await addItemToCart({
        // product: { id: product.sku.replace($config.theme.wishlistPrefix, '') },
        quantity: 1
      });

      addToCartError.value.addItem?.response?.data?.errors?.map((error) =>
        send({ message: error.detail, type: 'danger' })
      );
    };

    return {
      isAuthenticated,
      wishlistCartProducts,
      removeItem,
      isWishlistSidebarOpen,
      toggleWishlistSidebar,
      totals,
      totalItems,
      wishlistData,
      clear,
      productData,
      addToCart,
      isInCart
    };
  }
});
</script>

<style lang="scss" scoped>
.sidebar {
  --sidebar-z-index: 3;
  --overlay-z-index: 3;
  --sidebar-top-padding: var(--spacer-lg) var(--spacer-base) 0
    var(--spacer-base);
  --sidebar-content-padding: var(--spacer-lg) var(--spacer-base);
}

.my-wishlist {
  flex: 1;
  display: flex;
  flex-direction: column;
  &__total-items {
    font: var(--font-weight--normal) var(--font-size--lg) / 1.6
      var(--font-family--secondary);
    color: var(--c-link);
    margin: var(--spacer-xl) 0 0 0;
  }
  &__total-price {
    --property-name-font-size: var(--font-size--xl);
    --price-font-size: var(--font-size--xl);
    margin: 0 0 var(--spacer-xl) 0;
    &-label {
      font: var(--font-weight--normal) var(--font-size--2xl) / 1.6
        var(--font-family--secondary);
      color: var(--c-link);
    }
  }
}
.empty-wishlist {
  display: flex;
  flex: 1;
  flex-direction: column;
  &__banner {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  &__label,
  &__description {
    text-align: center;
  }
  &__label {
    --heading-description-margin: 0 0 var(--spacer-xl) 0;
    --heading-title-margin: 0 0 var(--spacer-xl) 0;
    --heading-title-color: var(--c-primary);
    --heading-title-font-weight: var(--font-weight--semibold);
    @include for-desktop {
      --heading-title-font-size: var(--font-size--xl);
      --heading-title-margin: 0 0 var(--spacer-sm) 0;
    }
  }
  &__icon {
    --image-width: 16rem;
    margin: 0 0 var(--spacer-2xl) 7.5rem;
  }
}
.heading {
  &__wrapper {
    --heading-title-color: var(--c-link);
    --heading-title-font-weight: var(--font-weight--semibold);
    display: flex;
    justify-content: space-between;
  }
}

.sidebar-bottom {
  margin: auto 0 0 0;
}

.collected-product {
  margin: var(--spacer-base) 0;
  &__properties {
    margin: var(--spacer-sm) 0 0 0;
  }
}

.clear-wishlist {
  --button-padding: var(--spacer-sm) 0;
  background: transparent;
  color: var(--c-secondary);
  justify-content: flex-start;

  &::before {
    box-shadow: none;
  }
}
</style>

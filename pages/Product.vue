<template>
  <div id="product">
    <SfBreadcrumbs
      class="breadcrumbs desktop-only"
      :breadcrumbs="breadcrumbs"
      v-if="product"
    />
    <SfLoader
      :class="{ loading: isProductLoading, main: true }"
      :loading="isProductLoading"
    >
      <div class="product" v-if="!isProductLoading">
        <LazyHydrate when-idle>
          <SfGallery
            :images="productGallery"
            class="product__gallery"
            :imageWidth="422"
            :imageHeight="500"
            :thumbWidth="160"
            :thumbHeight="160"
            :image-tag="'nuxt-img'"
            :thumb-image-tag="'nuxt-img'"
          />
        </LazyHydrate>

        <div class="product__info">
          <div class="product__header">
            <SfHeading
              :title="getName(product)"
              :level="3"
              class="sf-heading--no-underline sf-heading--left"
            />
            <SfIcon
              icon="drag"
              size="xxl"
              color="var(--c-text-disabled)"
              class="product__drag-icon smartphone-only"
            />
          </div>
          <div class="product__price-and-rating">
            <SfPrice
              :regular="getPrice(product).regular"
              :special="getPrice(product).special"
            />
            <div>
              <div v-if="isEnabledWishlist">
                <SfButton
                  class="sf-button--text"
                  @click="toggleWishlistItem(product)"
                  >{{ $t(wishlistToggleLabel) }}</SfButton
                >
              </div>
            </div>
          </div>
          <div>
            <SfButton class="sf-button--text desktop-only product__guide">
              {{ $t('Size guide') }}
            </SfButton>

            <template v-for="optionType in Object.keys(options)">
              <div
                :key="`swatch_${optionType}`"
                v-if="
                  optionType.toLowerCase() === 'color' &&
                  options[optionType].length > 1
                "
                class="product__colors"
              >
                <p class="product__color-label">{{ $t('Color') }}:</p>
                <SfColor
                  v-for="(color, i) in options[optionType]"
                  :key="i"
                  :color="color.value"
                  :selected="
                    configuration
                      ? color.value === configuration[optionType.toLowerCase()]
                      : false
                  "
                  class="product__color"
                  @click="updateFilter({ color: color.value })"
                />
              </div>

              <SfSelect
                :key="`dropdown_${optionType}`"
                v-e2e="`${optionType}-select`"
                v-else-if="options[optionType].length"
                :value="configuration[optionType.toLowerCase()]"
                @input="
                  (option) =>
                    updateFilter({ [optionType.toLowerCase()]: option })
                "
                :label="optionType"
                class="sf-select--underlined product__select-size"
                :required="true"
              >
                <SfSelectOption
                  v-for="option in options[optionType]"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </SfSelectOption>
              </SfSelect>
            </template>

            <SfAddToCart
              v-e2e="'product_add-to-cart'"
              v-model.number="qty"
              :disabled="loading || !hasStock(product)"
              class="product__add-to-cart"
            >
              <template #add-to-cart-btn>
                <SfButton
                  class="sf-add-to-cart__button"
                  :disabled="
                    loading ||
                    !hasStock(product) ||
                    !hasStock(product, qty)
                  "
                  @click="handleAddItemToCart({ product, quantity: qty })"
                >
                  {{ $t('Add to cart') }}
                </SfButton>
              </template>
            </SfAddToCart>

            <SfAlert
              v-if="!hasStock(product)"
              :message="$t('The product is out of stock.')"
              type="danger"
              class="product__alert"
            />

            <SfAlert
              v-if="hasStock(product) && !hasStock(product, qty)"
              :message="$t('The selected quantity exceeds available stock.')"
              type="danger"
              class="product__alert"
            />

            <SfAlert
              v-if="isLowOnStock(product)"
              :message="$t('The product is low on stock.')"
              type="warning"
              class="product__alert"
            />
          </div>

          <div class="product__bundle-components" v-if="isBundleProduct">
            <SfHeading :title="$t('Bundle Components')" :level="4" />

            <SfAccordion :show-chevron="true">
              <SfAccordionItem
                v-for="key in Object.keys(bundleComponents)"
                :key="key"
                :header="bundleComponents[key].name"
                class="bundle-components__item-wrapper"
              >
                <template>
                  <div v-if="bundleComponents[key].options[0]">
                    <h2>
                      {{ bundleComponents[key].options[0].attributes.name }}
                    </h2>
                    <p>
                      {{ $t('SKU') }}:
                      {{ bundleComponents[key].options[0].attributes.sku }}
                    </p>
                  </div>
                </template>
              </SfAccordionItem>
            </SfAccordion>
          </div>

          <LazyHydrate when-idle>
            <SfTabs :open-tab="1" class="product__tabs">
              <SfTab :title="$t('Description')">
                <div class="product__description">
                  {{ getDescription(product) }}
                </div>
                <SfProperty
                  v-for="(property, i) in properties"
                  :key="i"
                  :name="property.name"
                  :value="property.value"
                  class="product__property"
                >
                  <template v-if="property.name === 'Category'" #value>
                    <SfButton class="product__property__button sf-button--text">
                      {{ property.value }}
                    </SfButton>
                  </template>
                </SfProperty>
              </SfTab>
              <SfTab
                :title="$t('Additional Information')"
                class="product__additional-info"
              >
                <div
                  class="product__additional-info__wrapper"
                  v-for="attribute in getExtensionAttributes(product)"
                  :key="attribute"
                >
                  <p
                    class="product__additional-info__title"
                    v-if="getAttribute(product, attribute)"
                  >
                    {{ $t(attribute) }}
                  </p>
                  <p
                    class="product__additional-info__paragraph"
                    v-if="
                      typeof getAttribute(product, attribute) === 'boolean' &&
                      getAttribute(product, attribute)
                    "
                  >
                    {{ $t('Yes') }}
                  </p>
                  <p
                    class="product__additional-info__paragraph"
                    v-if="typeof getAttribute(product, attribute) == 'string'"
                  >
                    {{ getAttribute(product, attribute) }}
                  </p>
                </div>
              </SfTab>
              <SfTab
                :title="$t('Tier Pricing')"
                class="product__tier-pricing"
                v-show="getTiers(product).length"
              >
                <div class="product__tier-pricing__wrapper">
                  <i18n
                    v-for="tierPrice in getTiers(product)"
                    :key="`${tierPrice.minimum_quantity}_${tierPrice.price.regular}`"
                    tag="p"
                    class="product__tier-pricing__paragraph"
                    path="Buy over X units for"
                  >
                    <span class="product__tier-pricing__minimum_quantity">{{
                      tierPrice.minimum_quantity
                    }}</span>
                    <span class="product__tier-pricing__display_price">{{
                      tierPrice.price.regular
                    }}</span>
                  </i18n>
                </div>
              </SfTab>
            </SfTabs>
          </LazyHydrate>
        </div>
      </div>
    </SfLoader>

    <RelatedProducts
      :products="baseProduct.connected_products.related"
      v-if="
        baseProduct &&
        baseProduct.connected_products &&
        baseProduct.connected_products.related &&
        baseProduct.connected_products.related.length
      "
      :title="$t('Match it with')"
    />

    <RelatedProducts
      :products="baseProduct.connected_products.up_sell"
      v-if="
        baseProduct &&
        baseProduct.connected_products &&
        baseProduct.connected_products.up_sell &&
        baseProduct.connected_products.up_sell.length
      "
      :title="$t('Up sell items')"
    />

    <RelatedProducts
      :products="baseProduct.connected_products.cross_sell"
      v-if="
        baseProduct &&
        baseProduct.connected_products &&
        baseProduct.connected_products.cross_sell &&
        baseProduct.connected_products.cross_sell.length
      "
      :title="$t('Cross sell items')"
    />
  </div>
</template>

<script>
import {
  SfProperty,
  SfHeading,
  SfPrice,
  SfSelect,
  SfAddToCart,
  SfTabs,
  SfGallery,
  SfIcon,
  SfImage,
  SfBanner,
  SfAlert,
  SfSticky,
  SfBreadcrumbs,
  SfButton,
  SfColor,
  SfLoader,
  SfAccordion
} from '@storefront-ui/vue';
import {
  computed,
  defineComponent,
  onUnmounted,
  ref,
  ssrRef,
  useContext,
  useMeta,
  useRoute,
  useRouter
} from '@nuxtjs/composition-api';
import LazyHydrate from 'vue-lazy-hydration';
import cloneDeep from 'lodash.clonedeep';
import {
  useCart,
  useUser,
  useProduct,
  useWishlist,
  useProductData,
  useUiNotification
} from '@/composables';
import { useWishlistData } from '@/composables/useWishlistData';
import { onSSR } from '@vue-storefront/core';

export default defineComponent({
  name: 'Product',
  transition: 'fade',
  setup() {
    const { i18n, $config, error } = useContext();
    const router = useRouter();
    const route = useRoute();
    const qty = ref(1);
    const { query } = route.value;
    const configuration = ssrRef(query);
    const { id } = route.value.params;
    const { send } = useUiNotification();
    const {
      product,
      clear: clearProduct,
      search,
      loading: isProductLoading,
      error: productError
    } = useProduct(id);
    const { product: activeVariantProduct, clear: clearActiveVariant, search: searchActiveVariant } =
      useProduct(`v_${id}`);
    const productData = useProductData();
    const { addItem, loading, error: cartError } = useCart();
    const { isAuthenticated } = useUser();
    const {
      getName,
      getAttribute,
      getPrice,
      getActiveVariantId,
      hasStock,
      getExtensionAttributes,
      getTiers,
      isLowOnStock,
      getDescription,
      hasEnoughStock,
      getOptions,
      getGallery
    } = useProductData();
    const wishlistData = useWishlistData();
    const { wishlistEnabled } = $config.theme;
    const {
      wishlist,
      isInWishlist,
      addItem: addItemToWishlist,
      removeItem: removeItemFromWishlist,
      error: wishlistError
    } = useWishlist();
    const activeVariantId = ssrRef('', 'activeVariantId');
    const computedProduct = computed(() =>
      activeVariantProduct.value?.id
        ? activeVariantProduct.value
        : product.value
    );
    const wishlistToggleLabel = computed(() =>
      !isInWishlist({ product: computedProduct.value })
        ? 'Add to wishlist'
        : 'Remove from wishlist'
    );
    const baseProduct = computed(() => product.value);
    const isBundleProduct = computed(() =>
      Boolean(product.value?.attributes?.components)
    );
    const options = computed(() => getOptions(baseProduct.value));
    const isEnabledWishlist = computed(
      () =>
        (isAuthenticated.value && wishlistEnabled.authenticated) ||
        (!isAuthenticated.value && wishlistEnabled.guest)
    );

    // TODO: Breadcrumbs are temporary disabled because productGetters return undefined. We have a mocks in data
    // const breadcrumbs = computed(() => getBreadcrumbs ? getBreadcrumbs(baseProduct.value) : props.fallbackBreadcrumbs);
    const breadcrumbs = computed(() => [
      {
        text: 'Home',
        link: '/'
      },
      {
        text: getName(baseProduct.value),
        link: '#'
      }
    ]);

    const productGallery = computed(() =>
      getGallery(computedProduct.value).map((img) => ({
        mobile: { url: img.small },
        desktop: { url: img.normal },
        big: { url: img.big },
        alt: 'todo' || ''
      }))
    );

    const metaTags = computed(() => {
      const meta = {
        title: getAttribute(computedProduct, 'meta_title'),
        keywords: getAttribute(computedProduct, 'meta_keyword'),
        description: getAttribute(computedProduct, 'meta_description')
      };

      return {
        title: meta.title,
        meta: [
          { hid: 'title', name: 'title', content: meta.title },
          { hid: 'keyword', name: 'keyword', content: meta.keywords },
          {
            hid: 'description',
            name: 'description',
            content: meta.description
          }
        ]
      };
    });

    const calculateOptions = () => {
      configuration.value =
        baseProduct?.value?.meta?.variations?.reduce((all, variation) => {
          all[variation.name.toLowerCase()] =
            query[variation.name.toLowerCase()] ?? variation.options[0].name;
          return all;
        }, {}) ?? {};
    };

    const getVariationProductId = () => {
      activeVariantId.value = getActiveVariantId(
        baseProduct.value,
        configuration.value
      );
    };

    const bundleComponents = computed(() => {
      if (isBundleProduct.value) {
        const components = cloneDeep(baseProduct.value.attributes.components);

        Object.keys(components).forEach((key) => {
          components[key].options = components[key].options.map((option) => {
            return baseProduct.value.component_products.find(
              (product) => product.id === option.id
            );
          });
        });

        return components;
      }

      return undefined;
    });

    const clearProductResults = async () => {
      await clearProduct();
      await clearActiveVariant();
    };

    useMeta(() => metaTags.value);

    onSSR(async () => {
      if (baseProduct.value) {
        calculateOptions();
      }

      await search({
        id,
        withConnectedProducts: true,
        withInventory: true,
        locale: i18n.locale
      });

      if (productError.value.search || !computedProduct.value.id) {
        return error({
          statusCode: 404
        });
      }

      calculateOptions();
      getVariationProductId();

      if (activeVariantId.value) {
        await searchActiveVariant({
          id: activeVariantId.value,
          withConnectedProducts: false,
          withInventory: true,
          locale: i18n.locale
        });
      }
    });

    onUnmounted(async () => {
      if (
        !route.value?.name?.startsWith?.('product') ||
        route.value?.params?.id !== baseProduct.value?.id
      ) {
        await clearProductResults();
      }
    });

    const updateFilter = (filter) => {
      router.push({
        path: route.value.path,
        query: {
          ...configuration.value,
          ...filter
        }
      });
    };

    const toggleWishlistItem = async (product) => {
      const productInWishlist = isInWishlist({ product });
      if (productInWishlist) {
        const wishlistItem = wishlistData.getLineItemByProductId(
          wishlist.value.items,
          product
        );
        await removeItemFromWishlist({ wishlistItem });
      } else {
        await addItemToWishlist({ product });

        wishlistError.value.addItem?.response?.data?.errors?.map((error) =>
          send({ message: error.detail, type: 'danger' })
        );
      }
    };

    const handleAddItemToCart = async ({ product, quantity }) => {
      await addItem({ product, quantity });

      cartError.value.addItem?.response?.data?.errors?.map((error) =>
        send({ message: error.detail, type: 'danger' })
      );
    };

    return {
      updateFilter,
      configuration,
      product: computedProduct,
      baseProduct,
      productData,
      options,
      qty,
      handleAddItemToCart,
      loading,
      isProductLoading,
      getName,
      getAttribute,
      getVariationProductId,
      getPrice,
      getActiveVariantId,
      getGallery,
      hasStock,
      getTiers,
      getDescription,
      getExtensionAttributes,
      hasEnoughStock,
      isLowOnStock,
      getOptions,
      productGallery,
      breadcrumbs,
      isEnabledWishlist,
      toggleWishlistItem: isEnabledWishlist.value
        ? toggleWishlistItem
        : () => {},
      isInWishlist,
      wishlistToggleLabel,
      activeVariantId,
      activeVariantProduct,
      isBundleProduct,
      bundleComponents
    };
  },
  components: {
    SfAlert,
    SfColor,
    SfProperty,
    SfHeading,
    SfPrice,
    SfSelect,
    SfAddToCart,
    SfTabs,
    SfGallery,
    SfIcon,
    SfImage,
    SfBanner,
    SfSticky,
    SfBreadcrumbs,
    SfButton,
    LazyHydrate,
    SfLoader,
    SfAccordion,
    RelatedProducts: () =>
      import(
        /* webpackPrefetch: true */
        /* webpackChunkName: "related-products" */
        '@/components/RelatedProducts.vue'
      )
  },
  data() {
    return {
      properties: [],
      detailsIsActive: false
    };
  }
});
</script>

<style lang="scss">
.sf-select__label {
  color: var(--c-text);
  font: var(
    --product-color-font,
    var(--product-color-font-weight, var(--font-weight--normal))
      var(--product-color-font-size, var(--font-size--lg)) /
      var(--product-color-font-line-height, 1.6)
      var(--product-color-font-family, var(--font-family--secondary))
  );
  padding: 0 0 0.3rem 0;
  text-transform: capitalize;
}
</style>

<style lang="scss" scoped>
#product {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1272px;
    margin: 0 auto;
  }
}
.product {
  @include for-desktop {
    display: flex;
  }
  &__info {
    margin: var(--spacer-sm) auto;
    @include for-desktop {
      max-width: 32.625rem;
      margin: 0 0 0 7.5rem;
    }
  }
  &__header {
    --heading-title-color: var(--c-link);
    --heading-title-font-weight: var(--font-weight--bold);
    --heading-padding: 0;
    margin: 0 var(--spacer-sm);
    display: flex;
    justify-content: space-between;
    @include for-desktop {
      --heading-title-font-weight: var(--font-weight--semibold);
      margin: 0 auto;
    }
  }
  &__drag-icon {
    animation: moveicon 1s ease-in-out infinite;
  }
  &__price-and-rating {
    margin: 0 var(--spacer-sm) var(--spacer-base);
    align-items: center;
    @include for-desktop {
      display: flex;
      justify-content: space-between;
      margin: var(--spacer-sm) 0 var(--spacer-lg) 0;
    }
  }
  &__count {
    @include font(
      --count-font,
      var(--font-weight--normal),
      var(--font-size--sm),
      1.4,
      var(--font-family--secondary)
    );
    color: var(--c-text);
    text-decoration: none;
    margin: 0 0 0 var(--spacer-xs);
  }
  &__description {
    @include font(
      --product-description-font,
      var(--font-weight--light),
      var(--font-size--base),
      1.6,
      var(--font-family--primary)
    );
  }
  &__select-size {
    margin: 0 var(--spacer-sm);
    @include for-desktop {
      margin: 0;
    }
  }
  &__colors {
    @include font(
      --product-color-font,
      var(--font-weight--normal),
      var(--font-size--lg),
      1.6,
      var(--font-family--secondary)
    );
    display: flex;
    align-items: center;
    margin-top: 0;
    padding: var(--select-padding, 0 0 var(--spacer-sm) 0);
    @include for-mobile {
      margin: 0 var(--spacer-sm);
    }
  }
  &__color-label {
    margin: 0 var(--spacer-lg) 0 0;
  }
  &__color {
    margin: 0 var(--spacer-2xs);
  }
  &__add-to-cart {
    margin: var(--spacer-base) var(--spacer-sm) var(--spacer-sm);
    @include for-desktop {
      margin: var(--spacer-2xl) 0 var(--spacer-sm);
    }
  }
  &__alert {
    @include for-mobile {
      margin: 0 var(--spacer-sm);
    }
  }
  &__guide,
  &__compare,
  &__save {
    display: block;
    margin: var(--spacer-xl) 0 var(--spacer-base) auto;
  }
  &__compare {
    margin-top: 0;
  }
  &__tabs {
    --tabs-title-z-index: 0;
    margin: var(--spacer-lg) auto var(--spacer-2xl);
    --tabs-title-font-size: var(--font-size--lg);
    @include for-desktop {
      margin-top: var(--spacer-2xl);
    }
  }
  &__property {
    margin: var(--spacer-base) 0;
    &__button {
      --button-font-size: var(--font-size--base);
    }
  }
  &__additional-info {
    color: var(--c-link);
    @include font(
      --additional-info-font,
      var(--font-weight--light),
      var(--font-size--sm),
      1.6,
      var(--font-family--primary)
    );
    &__title {
      font-weight: var(--font-weight--normal);
      font-size: var(--font-size--base);
      margin: 0 0 var(--spacer-sm);
      &:not(:first-child) {
        margin-top: 3.5rem;
      }
    }
  }
  &__gallery {
    flex: 1;
  }
  &__bundle-components {
    margin-top: var(--spacer-2xl);

    .sf-accordion-item.is-open {
      border-bottom: 1px solid;
    }
  }
}
.bundle-components__item-wrapper {
  border-color: var(--c-light);
  border-style: solid;
  border-width: 0 1px 1px 1px;
  padding: 0 var(--spacer-sm);
}
.bundle-components__item-wrapper:first-child {
  border-top: 1px solid var(--c-light);
}
.breadcrumbs {
  margin: var(--spacer-base) auto var(--spacer-lg);
}
.sf-loader.main {
  min-height: 50vh;
}
@keyframes moveicon {
  0% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(0, 30%, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
}
</style>

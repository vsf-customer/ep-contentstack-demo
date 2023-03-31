<template>
  <div id="category">
    <SfBreadcrumbs
      class="breadcrumbs desktop-only"
      :breadcrumbs="breadcrumbs"
    />
    <div class="sf-heading__description category__description">
      {{ categoryData.getDescription(activeCategory) }}
    </div>
    <div class="navbar section">
      <div class="navbar__aside desktop-only">
        <LazyHydrate never>
          <SfHeading
            :level="3"
            :title="$t('Categories')"
            class="navbar__title"
          />
        </LazyHydrate>
      </div>

      <div class="navbar__main">
        <LazyHydrate on-interaction>
          <SfButton
            class="sf-button--text navbar__filters-button"
            :aria-label="$t('Filters')"
            @click="toggleFilterSidebar"
          >
            <SfIcon
              size="24px"
              color="dark-secondary"
              icon="filter2"
              class="navbar__filters-icon"
            />
            {{ $t('Filters') }}
          </SfButton>
        </LazyHydrate>

        <div class="navbar__sort desktop-only">
          <span class="navbar__label">{{ $t('Sort by') }}:</span>

          <SfSelect
            :value="sortBy.selected"
            :placeholder="$t('Select sorting')"
            class="navbar__select"
            @input="themeHelper.changeSorting"
          >
            <SfSelectOption
              v-for="option in sortBy.options"
              :key="option.id"
              :value="option.id"
              class="sort-by__option"
            >
              {{ $t(option.value) }}
            </SfSelectOption>
          </SfSelect>
        </div>

        <div class="navbar__counter">
          <span class="navbar__label desktop-only">
            {{ $t('Products found') }}:
          </span>
          <span class="desktop-only">{{ pagination.totalItems }}</span>
          <span class="navbar__label smartphone-only">
            {{ pagination.totalItems }} {{ $t('Items') }}
          </span>
        </div>

        <div class="navbar__view">
          <span class="navbar__view-label desktop-only">{{ $t('View') }}</span>
          <SfIcon
            v-e2e="'tiles-icon'"
            class="navbar__view-icon"
            :color="isCategoryGridView ? 'black' : 'dark-secondary'"
            icon="tiles"
            size="12px"
            role="button"
            :aria-label="$t('Change to grid view')"
            :aria-pressed="isCategoryGridView"
            @click="changeToCategoryGridView"
          />
          <SfIcon
            v-e2e="'list-icon'"
            class="navbar__view-icon"
            :color="!isCategoryGridView ? 'black' : 'dark-secondary'"
            icon="list"
            size="12px"
            role="button"
            :aria-label="$t('Change to list view')"
            :aria-pressed="!isCategoryGridView"
            @click="changeToCategoryListView"
          />
        </div>
      </div>
    </div>

    <div class="main section">
      <div class="sidebar desktop-only">
        <LazyHydrate when-idle>
          <SfLoader
            :class="{ 'loading--categories': isCategoriesLoading }"
            :loading="isCategoriesLoading"
          >
            <SfAccordion
              :open="
                categoryData.getName(
                  categoryData.getActiveSubCategory(
                    activeCategory,
                    categoryTree
                  )
                )
              "
              :show-chevron="true"
            >
              <SfAccordionItem
                v-for="(cat, i) in categoryTree && categoryTree.children"
                :key="i"
                :header="categoryData.getName(cat)"
              >
                <template>
                  <SfList class="list">
                    <SfListItem class="list__item">
                      <SfMenuItem
                        :count="cat.count || ''"
                        :label="categoryData.getName(cat)"
                      >
                        <template #label>
                          <nuxt-link
                            :to="localePath(themeHelper.getCatLink(cat))"
                            :class="
                              cat.isCurrent ? 'sidebar--cat-selected' : ''
                            "
                          >
                            All
                          </nuxt-link>
                        </template>
                      </SfMenuItem>
                    </SfListItem>
                    <SfListItem
                      class="list__item"
                      v-for="(subCat, j) in cat.children"
                      :key="j"
                    >
                      <SfMenuItem
                        :count="subCat.count || ''"
                        :label="categoryData.getName(subCat)"
                      >
                        <template #label="{ label }">
                          <nuxt-link
                            :to="localePath(themeHelper.getCatLink(subCat))"
                            :class="
                              subCat.isCurrent ? 'sidebar--cat-selected' : ''
                            "
                          >
                            {{ label }}
                          </nuxt-link>
                        </template>
                      </SfMenuItem>
                    </SfListItem>
                  </SfList>
                </template>
              </SfAccordionItem>
            </SfAccordion>
          </SfLoader>
        </LazyHydrate>
      </div>
      <SfLoader :class="{ loading }" :loading="loading">
        <div class="products" v-if="!loading">
          <div
            v-if="Array.isArray(products) && !products.length"
            class="no-products-message"
          >
            {{
              $t('We have no available products matching your search criteria.')
            }}
          </div>
          <transition-group
            v-show="isCategoryGridView"
            appear
            name="products__slide"
            tag="div"
            class="products__grid"
          >
            <SfProductCard
              v-e2e="'category-product-card'"
              v-for="(product, i) in products"
              :key="productData.getSlug(product)"
              :style="{ '--index': i }"
              :title="productData.getName(product)"
              :image="productData.getCoverImage(product)"
              :regular-price="productData.getPrice(product).regular"
              :special-price="productData.getPrice(product).special"
              :is-in-wishlist="
                isEnabledWishlist ? isInWishlist({ product }) : false
              "
              :wishlist-icon="isEnabledWishlist ? 'heart' : false"
              :show-add-to-cart-button="true"
              :add-to-cart-disabled="!productData.hasStock(product)"
              :isAddedToCart="isInCart({ product })"
              :link="
                localePath(
                  `/p/${productData.getId(product)}/${productData.getSlug(
                    product
                  )}`
                )
              "
              class="products__product-card"
              @click:wishlist="toggleWishlistItem(product)"
              @click:add-to-cart="handleAddItemToCart({ product, quantity: 1 })"
              :imageWidth="216"
              :imageHeight="216"
              :image-tag="
                productData.getCoverImage(product) ? 'nuxt-img' : 'img'
              "
            />
          </transition-group>
          <transition-group
            v-show="!isCategoryGridView"
            appear
            name="products__slide"
            tag="div"
            class="products__list"
          >
            <SfProductCardHorizontal
              v-e2e="'category-product-card'"
              v-for="(product, i) in products"
              :key="productData.getSlug(product)"
              :style="{ '--index': i }"
              :title="productData.getName(product)"
              :description="productData.getDescription(product)"
              :image="productData.getCoverImage(product)"
              :regular-price="productData.getPrice(product).regular"
              :special-price="productData.getPrice(product).special"
              :is-in-wishlist="
                isEnabledWishlist ? isInWishlist({ product }) : false
              "
              :wishlist-icon="isEnabledWishlist ? 'heart' : false"
              class="products__product-card-horizontal"
              @click:wishlist="toggleWishlistItem(product)"
              :link="
                localePath(
                  `/p/${productData.getId(product)}/${productData.getSlug(
                    product
                  )}`
                )
              "
              :imageWidth="140"
              :imageHeight="222"
              :image-tag="
                productData.getCoverImage(product) ? 'nuxt-img' : 'img'
              "
            >
              <template #add-to-cart>
                <SfAddToCart
                  class="sf-product-card-horizontal__add-to-cart desktop-only"
                >
                  <template #quantity-select-input>
                    <SfQuantitySelector
                      v-if="
                        !product.attributes.base_product &&
                        !product.attributes.components
                      "
                      :qty="productQuantities[product.id]"
                      :aria-label="$t('Quantity')"
                      :disabled="loading || !productData.hasStock(product)"
                      class="sf-add-to-cart__select-quantity"
                      @input="
                        (quantity) => changeProductQuantity(product, quantity)
                      "
                    />
                    <span v-else />
                  </template>
                  <template #add-to-cart-btn>
                    <SfButton
                      class="sf-add-to-cart__button"
                      :disabled="
                        loading ||
                        (!product.attributes.base_product &&
                          (!productData.hasStock(product) ||
                            !productData.hasStock(
                              product,
                              productQuantities[product.id]
                            )))
                      "
                      @click="
                        handleAddItemToCart({
                          product,
                          quantity: productQuantities[product.id]
                        })
                      "
                    >
                      {{ $t('Add to cart') }}
                    </SfButton>
                  </template>
                </SfAddToCart>
              </template>
              <template #actions>
                <SfButton
                  v-if="isEnabledWishlist"
                  class="sf-button--text desktop-only"
                  style="margin: 0 0 1rem auto; display: block"
                  @click="toggleWishlistItem(product)"
                >
                  {{
                    isInWishlist({ product })
                      ? $t('Remove from wishlist')
                      : $t('Add to wishlist')
                  }}
                </SfButton>
              </template>
            </SfProductCardHorizontal>
          </transition-group>

          <LazyHydrate on-interaction>
            <SfPagination
              v-if="!loading"
              class="products__pagination"
              v-show="pagination.totalPages > 1"
              :current="pagination.currentPage"
              :total="pagination.totalPages"
              :visible="5"
            />
          </LazyHydrate>

          <div v-show="pagination.totalItems" class="products__show-on-page">
            <span class="products__show-on-page__label">
              {{ $t('Show on page') }}
            </span>
            <SfSelect
              :value="pagination.itemsPerPage.toString()"
              class="products__items-per-page"
              @input="themeHelper.changeItemsPerPage"
            >
              <SfSelectOption
                v-for="option in pagination.pageOptions"
                :key="option"
                :value="option"
                class="products__items-per-page__option"
              >
                {{ option }}
              </SfSelectOption>
            </SfSelect>
          </div>
        </div>
      </SfLoader>
    </div>

    <LazyHydrate when-idle>
      <SfSidebar
        :visible="isFilterSidebarOpen"
        title="Filters"
        class="sidebar-filters"
        @close="toggleFilterSidebar"
      >
        <div class="filters desktop-only">
          <div v-for="(facet, i) in facets" :key="i">
            <SfHeading
              :level="4"
              :title="facet.label"
              class="filters__title sf-heading--left"
              :key="`filter-title-${facet.id}`"
            />
            <div
              v-if="isFacetColor(facet)"
              class="filters__colors"
              :key="`${facet.id}-colors`"
            >
              <SfColor
                v-for="option in facet.options"
                :key="`${facet.id}-${option.value}`"
                :color="option.value"
                :selected="isFilterSelected(facet, option)"
                class="filters__color"
                @click="() => selectFilter(facet, option)"
              />
            </div>
            <div v-else>
              <SfFilter
                v-for="option in facet.options"
                :key="`${facet.id}-${option.value}`"
                :label="
                  option.id + `${option.count ? ` (${option.count})` : ''}`
                "
                :selected="isFilterSelected(facet, option)"
                class="filters__item"
                @change="() => selectFilter(facet, option)"
              />
            </div>
          </div>
        </div>
        <SfAccordion class="filters smartphone-only">
          <div v-for="(facet, i) in facets" :key="i">
            <SfAccordionItem
              :key="`filter-title-${facet.id}`"
              :header="facet.label"
              class="filters__accordion-item"
            >
              <SfFilter
                v-for="option in facet.options"
                :key="`${facet.id}-${option.id}`"
                :label="option.id"
                :selected="isFilterSelected(facet, option)"
                class="filters__item"
                @change="() => selectFilter(facet, option)"
              />
            </SfAccordionItem>
          </div>
        </SfAccordion>
        <template #content-bottom>
          <div class="filters__buttons">
            <SfButton class="sf-button--full-width" @click="applyFilters">
              {{ $t('Done') }}
            </SfButton>
            <SfButton
              class="sf-button--full-width filters__button-clear"
              @click="clearFilters"
            >
              {{ $t('Clear all') }}
            </SfButton>
          </div>
        </template>
      </SfSidebar>
    </LazyHydrate>
  </div>
</template>

<script>
import {
  useCart,
  useUser,
  useFacet,
  useUiState,
  useCategory,
  useWishlist,
  useFacetData,
  useUiHelpers,
  useProductData,
  useCategoryData,
  useWishlistData,
  useUiNotification
} from '@/composables';
import {
  SfList,
  SfIcon,
  SfColor,
  SfButton,
  SfFilter,
  SfSelect,
  SfSidebar,
  SfLoader,
  SfHeading,
  SfMenuItem,
  SfProperty,
  SfAddToCart,
  SfAccordion,
  SfPagination,
  SfBreadcrumbs,
  SfProductCard,
  SfQuantitySelector,
  SfProductCardHorizontal
} from '@storefront-ui/vue';
import {
  ref,
  computed,
  onMounted,
  useRouter,
  useContext,
  defineComponent
} from '@nuxtjs/composition-api';
import Vue from 'vue';
import { onSSR } from '@vue-storefront/core';
import LazyHydrate from 'vue-lazy-hydration';

export default defineComponent({
  name: 'CategoryPage',
  transition: 'fade',
  setup(props, context) {
    const router = useRouter();
    const { i18n, localePath, query, $config, error } = useContext();
    const { page, itemsPerPage } = query.value;
    const themeHelper = useUiHelpers();
    const uiState = useUiState();
    const { send } = useUiNotification();
    const { addItem: addItemToCart, isInCart, error: cartError } = useCart();
    const {
      wishlist,
      isInWishlist,
      addItem: addItemToWishlist,
      removeItem: removeItemFromWishlist,
      error: wishlistError
    } = useWishlist();
    const { result, search, loading, error: facetError } = useFacet();
    const facetData = useFacetData();
    const productData = useProductData();
    const categoryData = useCategoryData();
    const wishlistData = useWishlistData();
    const {
      categories,
      search: searchCategories,
      loading: isCategoriesLoading
    } = useCategory(themeHelper.getRootCategoryFromUrl());
    const term = ref(themeHelper.getFacetsFromURL().term);
    const { isAuthenticated } = useUser();
    const { wishlistEnabled } = $config.theme;

    const productQuantities = ref({});
    const changeProductQuantity = (product, quantity) => {
      productQuantities.value[product.id] = quantity;
    };

    const isEnabledWishlist = computed(
      () =>
        (isAuthenticated.value && wishlistEnabled.authenticated) ||
        (!isAuthenticated.value && wishlistEnabled.guest)
    );

    const categoryTree = computed(() => {
      const rootCategorySlug = themeHelper.getRootCategoryFromUrl();
      return categoryData.getTree(rootCategorySlug, categories?.value);
    });

    const products = computed(() => {
      const products = facetData.getProducts(result.value);
      productQuantities.value = products.reduce((allQuantities, product) => {
        return {
          ...allQuantities,
          [product.id]: productQuantities.value[product.id] || 1
        };
      }, {});
      return products;
    });

    const breadcrumbs = computed(() => [
      { text: i18n.t('Home'), link: localePath('/') },
      ...facetData.getBreadcrumbs(result.value)
    ]);

    const sortBy = computed(() => facetData.getSortOptions(result.value));
    const facets = computed(() =>
      facetData.getGrouped(result.value, ['color', 'size'])
    );
    const pagination = computed(() => facetData.getPagination(result.value));
    const activeCategory = computed(() => {
      const searchCurrentCategory = (categoryTree) => {
        if (categoryTree?.isCurrent) {
          return categoryTree;
        } else if (categoryTree?.children?.length) {
          let result = null;

          for (let i = 0; !result && i < categoryTree.children.length; i++) {
            result = searchCurrentCategory(categoryTree.children[i]);
          }

          return result;
        }

        return null;
      };

      return searchCurrentCategory(categoryTree.value);
    });

    const selectedFilters = ref({});
    const setSelectedFilters = () => {
      if (!facets.value.length || Object.keys(selectedFilters.value).length)
        return;
      selectedFilters.value = facets.value.reduce(
        (prev, curr) => ({
          ...prev,
          [curr.id]: curr.options.filter((o) => o.selected).map((o) => o.id)
        }),
        {}
      );
    };

    onSSR(async () => {
      const currentCategorySlug = themeHelper.getCategoryFromUrl();
      const rootCategorySlug = themeHelper.getRootCategoryFromUrl();
      const { itemsPerPage: limit, sort } = themeHelper.getFacetsFromURL();

      const isSortValid = Boolean(
        sort === undefined ||
          $config.theme?.product?.sortOptions?.find(
            (option) => option.id === sort
          )
      );

      const productSearchParams = term.value
        ? {
          filter: {
            eq: {
              name: term.value
            }
          },
          locale: i18n.locale
        }
        : {
          categorySlug: currentCategorySlug,
          rootCategorySlug,
          offset: page && page > 1 ? (page - 1) * limit : 0,
          limit,
          sort: isSortValid ? sort : undefined,
          locale: i18n.locale
        };

      await Promise.all([
        searchCategories({
          rootCategorySlug,
          currentCategorySlug,
          limit: 100
        }),
        search(productSearchParams)
      ]);

      if (facetError.value.search) {
        return error({
          statusCode: facetError.value.search.statusCode ?? 404,
          message: facetError.value.search.message
        });
      }

      setSelectedFilters();
    });

    const { changeFilters, isFacetColor } = useUiHelpers();
    const { toggleFilterSidebar } = useUiState();

    onMounted(() => {
      context.root.$scrollTo(context.root.$el, 2000);
      setSelectedFilters();
    });

    const isFilterSelected = (facet, option) =>
      (selectedFilters.value[facet.id] || []).includes(option.id);

    const selectFilter = (facet, option) => {
      if (!selectedFilters.value[facet.id]) {
        Vue.set(selectedFilters.value, facet.id, []);
      }

      if (selectedFilters.value[facet.id].find((f) => f === option.id)) {
        selectedFilters.value[facet.id] = selectedFilters.value[
          facet.id
        ].filter((f) => f !== option.id);
        return;
      }

      selectedFilters.value[facet.id].push(option.id);
    };

    const clearFilters = () => {
      toggleFilterSidebar();
      selectedFilters.value = {};
      changeFilters(selectedFilters.value);
    };

    const applyFilters = () => {
      toggleFilterSidebar();
      changeFilters(selectedFilters.value);
    };

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
      product.attributes.base_product || product.attributes.components
        ? router.push(
          localePath(
            `/p/${productData.getId(product)}/${productData.getSlug(product)}`
          )
        )
        : await addItemToCart({
          product,
          quantity
        });

      cartError.value.addItem?.response?.data?.errors?.map((error) =>
        send({
          message: error.detail,
          type: 'danger'
        })
      );
    };

    return {
      ...uiState,
      themeHelper,
      products,
      categoryTree,
      categoryData,
      loading,
      isCategoriesLoading,
      productData,
      pagination,
      activeCategory,
      sortBy,
      facets,
      breadcrumbs,
      isInWishlist,
      toggleWishlistItem: isEnabledWishlist.value
        ? toggleWishlistItem
        : () => {},
      handleAddItemToCart,
      isInCart,
      isFacetColor,
      selectFilter,
      isFilterSelected,
      selectedFilters,
      clearFilters,
      applyFilters,
      page,
      itemsPerPage,
      isEnabledWishlist,
      productQuantities,
      changeProductQuantity
    };
  },
  components: {
    SfAddToCart,
    SfButton,
    SfSidebar,
    SfIcon,
    SfList,
    SfFilter,
    SfProductCard,
    SfProductCardHorizontal,
    SfPagination,
    SfMenuItem,
    SfAccordion,
    SfSelect,
    SfBreadcrumbs,
    SfLoader,
    SfColor,
    SfHeading,
    SfProperty,
    SfQuantitySelector,
    LazyHydrate
  }
});
</script>

<style lang="scss" scoped>
#category {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1240px;
    margin: 0 auto;
  }
}
.category {
  &__description {
    margin: var(--spacer-sm) 0;
    @include for-mobile {
      margin: var(--spacer-sm);
    }
  }
}
.main {
  &.section {
    padding: var(--spacer-xs);
    @include for-desktop {
      padding: 0;
    }
  }
}
.breadcrumbs {
  margin: var(--spacer-base) auto var(--spacer-lg);
}
.navbar {
  position: relative;
  display: flex;
  border: 1px solid var(--c-light);
  border-width: 0 0 1px 0;
  @include for-desktop {
    border-width: 1px 0 1px 0;
  }
  &.section {
    padding: var(--spacer-sm);
    @include for-desktop {
      padding: 0;
    }
  }
  &__aside,
  &__main {
    display: flex;
    align-items: center;
    padding: var(--spacer-sm) 0;
  }
  &__aside {
    flex: 0 0 15%;
    padding: var(--spacer-sm) var(--spacer-sm);
    border: 1px solid var(--c-light);
    border-width: 0 1px 0 0;
  }
  &__main {
    flex: 1;
    padding: 0;
    justify-content: space-between;
    @include for-desktop {
      padding: var(--spacer-xs) var(--spacer-xl);
    }
  }
  &__title {
    --heading-title-font-weight: var(--font-weight--semibold);
    --heading-title-font-size: var(--font-size--xl);
  }
  &__filters-icon {
    margin: 0 0 0 var(--spacer-xs);
    order: 1;
    @include for-desktop {
      margin: 0 var(--spacer-xs) 0 0;
      order: 0;
    }
  }
  &__filters-button {
    display: flex;
    align-items: center;
    --button-font-size: var(--font-size--base);
    --button-text-decoration: none;
    --button-color: var(--c-link);
    --button-font-weight: var(--font-weight--normal);
    @include for-mobile {
      --button-font-weight: var(--font-weight--medium);
      order: 2;
    }
    svg {
      fill: var(--c-text-muted);
      transition: fill 150ms ease;
    }
    &:hover {
      svg {
        fill: var(--c-primary);
      }
    }
  }
  &__label {
    font-family: var(--font-family--secondary);
    font-weight: var(--font-weight--normal);
    color: var(--c-text-muted);
    @include for-desktop {
      color: var(--c-link);
      margin: 0 var(--spacer-2xs) 0 0;
    }
  }
  &__select {
    --select-width: 220px;
    --select-padding: 0;
    --select-height: auto;
    --select-selected-padding: 0 var(--spacer-lg) 0 var(--spacer-2xs);
    --select-margin: 0;
    --select-option-font-size: var(--font-size-sm);
    --select-error-message-height: 0;
    ::v-deep .sf-select__dropdown {
      font-size: var(--font-size-sm);
      font-family: var(--font-family--secondary);
      font-weight: var(--font-weight--light);
      margin: 0;
    }
    ::v-deep .sf-select__placeholder {
      --select-option-font-size: var(--font-size-sm);
    }
  }
  &__sort {
    display: flex;
    align-items: center;
    margin: 0 auto 0 var(--spacer-2xl);
  }
  &__counter {
    font-family: var(--font-family--secondary);
    order: 1;
    @include for-desktop {
      margin: auto 0 auto auto;
      order: 0;
    }
  }
  &__view {
    display: flex;
    align-items: center;
    order: 0;
    @include for-desktop {
      margin: 0 0 0 var(--spacer-2xl);
      order: 0;
    }
    &-icon {
      cursor: pointer;
      margin: 0 var(--spacer-base) 0 0;
      &:last-child {
        margin: 0;
      }
    }
    &-label {
      margin: 0 var(--spacer-sm) 0 0;
      font: var(--font-weight--normal) var(--font-size--base) / 1.6
        var(--font-family--secondary);
      text-decoration: none;
      color: var(--c-link);
    }
  }
}
.sort-by {
  flex: unset;
  width: 11.875rem;
}
.main {
  display: flex;
}
.sidebar {
  flex: 0 0 15%;
  padding: var(--spacer-sm);
  border: 1px solid var(--c-light);
  border-width: 0 1px 0 0;
}
.sidebar-filters {
  --overlay-z-index: 3;
  --sidebar-title-display: none;
  --sidebar-top-padding: 0;
  @include for-desktop {
    --sidebar-content-padding: 0 var(--spacer-xl);
    --sidebar-bottom-padding: 0 var(--spacer-xl);
  }
}
.list {
  --menu-item-font-size: var(--font-size--sm);
  &__item {
    &:not(:last-of-type) {
      --list-item-margin: 0 0 var(--spacer-sm) 0;
    }
    .nuxt-link-exact-active {
      text-decoration: underline;
    }
  }
}
.products {
  box-sizing: border-box;
  flex: 1;
  margin: 0;
  &__grid {
    justify-content: center;
    @include for-desktop {
      justify-content: flex-start;
    }
  }
  &__grid,
  &__list {
    display: flex;
    flex-wrap: wrap;
  }
  &__product-card {
    --product-card-title-margin: var(--spacer-base) 0 0 0;
    --product-card-title-font-weight: var(--font-weight--medium);
    --product-card-title-margin: var(--spacer-xs) 0 0 0;
    flex: 1 1 50%;
    @include for-desktop {
      --product-card-title-font-weight: var(--font-weight--normal);
      --product-card-add-button-bottom: var(--spacer-base);
      --product-card-title-margin: var(--spacer-sm) 0 0 0;
    }
    &__image {
      min-height: 220px;
      align-items: center;
      display: flex;
    }
  }
  &__product-card-horizontal {
    flex: 0 0 100%;
    @include for-mobile {
      ::v-deep .sf-image {
        --image-width: 5.3125rem;
        --image-height: 7.0625rem;
      }
    }
  }
  &__slide-enter {
    opacity: 0;
    transform: scale(0.5);
  }
  &__slide-enter-active {
    transition: all 0.2s ease;
    transition-delay: calc(0.1s * var(--index));
  }
  &__pagination {
    display: flex;
    justify-content: center;
    margin: var(--spacer-lg) 0 0 0;
  }
  @include for-desktop {
    &__grid {
      margin: var(--spacer-sm) 0 0 var(--spacer-sm);
    }
    &__pagination {
      margin: var(--spacer-xl) 0 0 0;
    }
    &__product-card-horizontal {
      margin: var(--spacer-lg) 0;
    }
    &__product-card {
      flex: 1 1 25%;
    }
    &__list {
      margin: 0 0 0 var(--spacer-sm);
    }
  }
  &__show-on-page {
    display: flex;
    justify-content: flex-end;
    align-items: baseline;
    &__label {
      font-family: var(--font-family--secondary);
      font-size: var(--font-size--sm);
    }
  }
}
.loading {
  margin: var(--spacer-3xl) auto;
  @include for-desktop {
    margin-top: 6.25rem;
  }
  &--categories {
    @include for-desktop {
      margin-top: 3.75rem;
    }
  }
}
::v-deep .sf-sidebar__aside {
  --sidebar-z-index: 3;
}
.no-products-message {
  padding: 2rem;
  font-family: var(--font-family--secondary);
  font-size: var(--font-size--md);
}
.filters {
  &__title {
    --heading-title-font-size: var(--font-size--xl);
    margin: var(--spacer-xl) 0 var(--spacer-base) 0;
    &:first-child {
      margin: calc(var(--spacer-xl) + var(--spacer-base)) 0 var(--spacer-xs) 0;
    }
  }
  &__colors {
    display: flex;
  }
  &__color {
    margin: var(--spacer-xs) var(--spacer-xs) var(--spacer-xs) 0;
  }
  &__chosen {
    color: var(--c-text-muted);
    font-weight: var(--font-weight--normal);
    font-family: var(--font-family--secondary);
    position: absolute;
    right: var(--spacer-xl);
  }
  &__item {
    --radio-container-padding: 0 var(--spacer-sm) 0 var(--spacer-xl);
    --radio-background: transparent;
    --filter-label-color: var(--c-secondary-variant);
    --filter-count-color: var(--c-secondary-variant);
    --checkbox-padding: 0 var(--spacer-sm) 0 var(--spacer-xl);
    padding: var(--spacer-sm) 0;
    border-bottom: 1px solid var(--c-light);
    &:last-child {
      border-bottom: 0;
    }
    @include for-desktop {
      --checkbox-padding: 0;
      margin: var(--spacer-sm) 0;
      border: 0;
      padding: 0;
    }
  }
  &__accordion-item {
    --accordion-item-content-padding: 0;
    position: relative;
    left: 50%;
    right: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
    width: 100vw;
  }
  &__buttons {
    margin: var(--spacer-sm) 0;
  }
  &__button-clear {
    --button-background: var(--c-light);
    --button-color: var(--c-dark-variant);
    margin: var(--spacer-xs) 0 0 0;
  }
}
</style>

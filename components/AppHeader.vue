<template>
  <div>
    <SfHeader
      class="sf-header--has-mobile-search"
      :class="{ 'header-on-top': isSearchOpen }"
      :isNavVisible="isMobileMenuOpen"
    >
      <!-- TODO: add mobile view buttons after SFUI team PR -->
      <template #logo>
        <Logo />
      </template>
      <template #navigation>
        <HeaderNavigation />
      </template>
      <template #aside>
        <LocaleSelector class="smartphone-only" />
      </template>
      <template #header-icons>
        <div class="sf-header__icons">
          <SfButton
            v-e2e="'app-header-account'"
            class="sf-button--pure sf-header__action"
            @click="handleAccountClick"
          >
            <SfIcon :icon="accountIcon" size="1.25rem" />
          </SfButton>
          <SfButton
            class="sf-button--pure sf-header__action"
            @click="toggleWishlistSidebar"
          >
            <SfIcon class="sf-header__icon" icon="heart" size="1.25rem" />
            <SfBadge
              v-if="wishlistTotalItems"
              class="sf-badge--number cart-badge"
            >
              {{ wishlistTotalItems }}
            </SfBadge>
          </SfButton>
          <SfButton
            v-e2e="'app-header-cart'"
            class="sf-button--pure sf-header__action"
            @click="toggleCartSidebar"
          >
            <SfIcon class="sf-header__icon" icon="empty_cart" size="1.25rem" />
            <SfBadge
              v-if="cartTotalItems"
              class="sf-badge--number cart-badge"
              >{{ cartTotalItems }}</SfBadge
            >
          </SfButton>
        </div>
      </template>
      <template #search>
        <SfSearchBar
          ref="searchBarRef"
          :placeholder="$t('Search for items')"
          :aria-label="$t('Search')"
          class="sf-header__search"
          :value="searchTerm"
          @input="handleSearch"
          @keydown.enter="handleSearch($event)"
          @focus="isSearchOpen = Boolean(searchTerm)"
          @keydown.esc="closeSearch"
          v-click-outside="closeSearch"
        >
          <template #icon>
            <SfButton
              v-if="searchTerm"
              class="sf-search-bar__button sf-button--pure"
            >
              <span class="sf-search-bar__icon">
                <SfIcon color="var(--c-text)" size="18px" icon="cross" />
              </span>
            </SfButton>
            <SfButton
              v-else
              class="sf-search-bar__button sf-button--pure"
              @click="isSearchOpen = true"
            >
              <span class="sf-search-bar__icon">
                <SfIcon color="var(--c-text)" size="20px" icon="search" />
              </span>
            </SfButton>
          </template>
        </SfSearchBar>
      </template>
    </SfHeader>
    <SearchResults
      :visible="Boolean(isSearchOpen && searchTerm)"
      :result="result"
      @close="closeSearch"
    />
    <SfOverlay :visible="Boolean(isSearchOpen && searchTerm)" />
  </div>
</template>

<script>
import {
  useCart,
  useUser,
  useFacet,
  useUiState,
  useCartData,
  useWishlist,
  useUiHelpers,
  useWishlistData
} from '@/composables';
import {
  SfIcon,
  SfBadge,
  SfImage,
  SfButton,
  SfHeader,
  SfOverlay,
  SfSearchBar
} from '@storefront-ui/vue';
import {
  ref,
  watch,
  computed,
  useRouter,
  useContext,
  defineComponent
} from '@nuxtjs/composition-api';
import debounce from 'lodash.debounce';
import SearchResults from '@/components/SearchResults';
import LocaleSelector from '@/components/LocaleSelector';
import HeaderNavigation from '@/components/HeaderNavigation';
import { clickOutside } from '@storefront-ui/vue/src/utilities/directives/click-outside/click-outside-directive.js';
import Logo from './Logo.vue';
import CmsHeaderNavigation from './CmsHeaderNavigation.vue';

export default defineComponent({
  components: {
    SfHeader,
    SfImage,
    LocaleSelector,
    SfIcon,
    SfButton,
    SfBadge,
    SfSearchBar,
    SearchResults,
    SfOverlay,
    HeaderNavigation,
    Logo,
    CmsHeaderNavigation
},
  directives: { clickOutside },
  setup() {
    const router = useRouter();
    const { localePath } = useContext();
    const {
      toggleCartSidebar,
      toggleWishlistSidebar,
      toggleLoginModal,
      isMobileMenuOpen
    } = useUiState();
    const { setTermForUrl, getFacetsFromURL } = useUiHelpers();
    const cartData = useCartData();
    const wishlistData = useWishlistData();
    const { isAuthenticated } = useUser();
    const { cart } = useCart();
    const { wishlist } = useWishlist();
    const { result, search } = useFacet('searchPanel');
    const searchTerm = ref(getFacetsFromURL().term);
    const isSearchOpen = ref(false);
    const searchBarRef = ref(null);
    const cartTotalItems = computed(() => {
      return cartData.getTotalItems(cart.value);
    });
    const wishlistTotalItems = computed(() => {
      return wishlistData.getTotalItems(wishlist?.value?.items);
    });
    const accountIcon = computed(() =>
      isAuthenticated.value ? 'profile_fill' : 'profile'
    );
    // TODO: https://github.com/vuestorefront/vue-storefront/issues/4927
    const handleAccountClick = async () => {
      if (isAuthenticated.value) {
        const localeAccountPath = localePath({ name: 'my-account' });
        return router.push(localeAccountPath);
      }

      toggleLoginModal();
    };

    const closeSearch = () => {
      if (!isSearchOpen.value) return;
      searchTerm.value = '';
      isSearchOpen.value = false;
    };

    const handleSearch = debounce(async (paramValue) => {
      if (!paramValue.target) {
        searchTerm.value = paramValue;
      } else {
        searchTerm.value = paramValue.target.value;
      }

      // todo: replace operator 'eq' with 'like' once its supported by EP
      await search({
        search: true,
        filter: {
          eq: {
            name: searchTerm.value
          }
        }
      });
      if (paramValue.key === 'Enter' && searchTerm.value) {
        isSearchOpen.value = false;
        return router.push(`/search?term=${searchTerm.value}`);
      }
    }, 1000);

    watch(
      () => searchTerm.value,
      () => {}
    );
    return {
      accountIcon,
      cartTotalItems,
      wishlistTotalItems,
      handleAccountClick,
      toggleCartSidebar,
      toggleWishlistSidebar,
      setTermForUrl,
      searchTerm,
      isSearchOpen,
      closeSearch,
      handleSearch,
      result,
      searchBarRef,
      isMobileMenuOpen
    };
  }
});
</script>

<style lang="scss" scoped>
.sf-header {
  --header-padding: var(--spacer-sm);
  @include for-desktop {
    --header-padding: 0;
  }

  &__logo-image {
    height: 100%;
  }
}

.header-on-top {
  z-index: 2;
}

.nav-item {
  --header-navigation-item-margin: 0 var(--spacer-base);

  .sf-header-navigation-item__item--mobile {
    display: none;
  }
}

.cart-badge {
  position: absolute;
  bottom: 40%;
  left: 40%;
}
</style>

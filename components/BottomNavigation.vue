<template>
  <!-- TODO: create logic with isActive prop for BottomNavigationItems -->
  <SfBottomNavigation class="navigation-bottom smartphone-only">
    <SfBottomNavigationItem
      :class="route.path == '/' ? 'sf-bottom-navigation__item--active' : ''"
      icon="home"
      size="20px"
      :label="$t('Home')"
      @click="handleHomeClick"
    />
    <SfBottomNavigationItem
      icon="menu"
      size="20px"
      label="Menu"
      @click="toggleMobileMenu"
    />
    <SfBottomNavigationItem
      icon="heart"
      size="20px"
      label="Wishlist"
      @click="toggleWishlistSidebar"
    />
    <SfBottomNavigationItem
      :icon="accountIcon"
      size="20px"
      label="Account"
      @click="handleAccountClick"
    />
    <!-- TODO: add logic for label - if on Home then Basket, if on PDC then AddToCart etc. -->
    <SfBottomNavigationItem
      label="Basket"
      icon="add_to_cart"
      @click="toggleCartSidebar"
    >
      <template #icon>
        <SfCircleIcon class="cart-button" aria-label="Add to cart">
          <SfIcon
            icon="add_to_cart"
            color="white"
            size="25px"
            :style="{ margin: '0 0 0 -2px' }"
          />
          <SfBadge v-if="cartTotalItems" class="sf-badge--number cart-badge">
            {{ cartTotalItems }}
          </SfBadge>
        </SfCircleIcon>
      </template>
    </SfBottomNavigationItem>
  </SfBottomNavigation>
</template>

<script>
import {
  SfBottomNavigation,
  SfIcon,
  SfCircleIcon,
  SfBadge
} from '@storefront-ui/vue';
import { useCart, useCartData, useUiState, useUser } from '@/composables';
import {
  computed,
  defineComponent,
  useRoute,
  useRouter,
  useContext
} from '@nuxtjs/composition-api';

export default defineComponent({
  components: {
    SfBottomNavigation,
    SfIcon,
    SfCircleIcon,
    SfBadge
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { localePath } = useContext();
    const {
      toggleCartSidebar,
      toggleWishlistSidebar,
      toggleLoginModal,
      toggleMobileMenu,
      isMobileMenuOpen
    } = useUiState();
    const cartData = useCartData();
    const { isAuthenticated } = useUser();
    const { cart } = useCart();

    const handleAccountClick = async () => {
      if (isMobileMenuOpen.value) toggleMobileMenu();
      if (isAuthenticated.value) {
        const localeAccountPath = localePath({ name: 'my-account' });
        return router.push(localeAccountPath);
      }

      toggleLoginModal();
    };

    const handleHomeClick = () => {
      isMobileMenuOpen.value && toggleMobileMenu();
      router.push('/');
    };

    const cartTotalItems = computed(() => {
      const count = cartData.getTotalItems(cart.value);

      return count ? count.toString() : null;
    });

    const accountIcon = computed(() =>
      isAuthenticated.value ? 'profile_fill' : 'profile'
    );

    return {
      route,
      isMobileMenuOpen,
      toggleWishlistSidebar,
      toggleCartSidebar,
      toggleMobileMenu,
      cartTotalItems,
      handleAccountClick,
      handleHomeClick,
      accountIcon
    };
  }
});
</script>

<style lang="scss" scoped>
.navigation-bottom {
  --bottom-navigation-z-index: 3;
}
.cart-button {
  position: relative;
}
.cart-badge {
  position: absolute;
  top: 0;
  right: 0;
}
</style>

<template>
  <div>
    <LazyHydrate when-visible>
      <TopBar class="desktop-only" />
    </LazyHydrate>

    <AppHeader />

    <div id="layout">
      <nuxt :key="route.fullPath" />

      <BottomNavigation />
      <LoginModal />
      <CartSidebar />
      <WishlistSidebar />
      <Notification />
    </div>
    <LazyHydrate when-visible>
      <AppFooter />
    </LazyHydrate>
  </div>
</template>

<script>
import {
  useCart,
  useUser,
  useStore,
  useLocale,
  useWishlist
} from '@/composables';
import {
  watch,
  useAsync,
  useRoute,
  onMounted,
  defineComponent
} from '@nuxtjs/composition-api';
import LazyHydrate from 'vue-lazy-hydration';
import AppHeader from '@/components/AppHeader.vue';
import Notification from '@/components/Notification';
import BottomNavigation from '@/components/BottomNavigation.vue';

export default defineComponent({
  name: 'DefaultLayout',

  components: {
    AppHeader,
    LazyHydrate,
    Notification,
    BottomNavigation,
    TopBar: () =>
      import(
        /* webpackPrefetch: true */
        /* webpackChunkName: "top-bar" */
        '@/components/TopBar.vue'
      ),
    AppFooter: () =>
      import(
        /* webpackPrefetch: true */
        /* webpackChunkName: "app-footer" */
        '@/components/AppFooter.vue'
      ),
    LoginModal: () =>
      import(
        /* webpackPrefetch: true */
        /* webpackChunkName: "login-modal" */
        '@/components/LoginModal.vue'
      ),
    CartSidebar: () =>
      import(
        /* webpackPrefetch: true */
        /* webpackChunkName: "cart-sidebar" */
        '@/components/CartSidebar.vue'
      ),
    WishlistSidebar: () =>
      import(
        /* webpackPrefetch: true */
        /* webpackChunkName: "wishlist-sidebar" */
        '@/components/WishlistSidebar.vue'
      )
  },

  setup() {
    const route = useRoute();
    const { load: loadCart } = useCart();
    const { load: loadStores } = useStore();
    const { load: loadLocale } = useLocale();
    const { load: loadUser, isAuthenticated } = useUser();
    const { load: loadWishlist, set: setWishlist } = useWishlist();

    onMounted(async () => {
      await Promise.all([loadStores(), loadUser(), loadCart(), loadLocale()]);
    });

    useAsync(async () => {
      await Promise.all([loadWishlist()]);
    });

    watch(isAuthenticated, () => {
      setWishlist(null);
      loadWishlist();
    });

    return {
      route
    };
  }
});
</script>

<style lang="scss">
@import '~@storefront-ui/vue/styles';
.sf-content-pages__section {
  &.is-active {
    .sf-modal__container {
      @include for-mobile {
        transform: translate3d(100%, 0, 0);
      }
    }
  }
}

#layout {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1240px;
    margin: auto;
  }
}

.no-scroll {
  overflow: hidden;
  height: 100vh;
}

// Reset CSS
html {
  width: auto;
  @include for-mobile {
    overflow-x: hidden;
  }
}
body {
  overflow-x: hidden;
  color: var(--c-text);
  font-size: var(--font-size--base);
  font-family: var(--font-family--primary);
  margin: 0;
  padding: 0;
}
a {
  text-decoration: none;
  color: var(--c-link);
  &:hover {
    color: var(--c-link-hover);
  }
}
h1 {
  font-family: var(--font-family--secondary);
  font-size: var(--h1-font-size);
  line-height: 1.6;
  margin: 0;
}
h2 {
  font-family: var(--font-family--secondary);
  font-size: var(--h2-font-size);
  line-height: 1.6;
  margin: 0;
}
h3 {
  font-family: var(--font-family--secondary);
  font-size: var(--h3-font-size);
  line-height: 1.6;
  margin: 0;
}
h4 {
  font-family: var(--font-family--secondary);
  font-size: var(--h4-font-size);
  line-height: 1.6;
  margin: 0;
}

.sf-gallery__big-image {
  img.sf-image {
    width: 422px;
    height: 644px;

    @include for-mobile {
      height: 500px;
    }
  }
}

.sf-product-card {
  img.sf-image {
    width: 216px;
    height: 216px;

    @include for-mobile {
      width: 154px;
      height: 154px;
    }
  }
}

.products__product-card {
  img.sf-image {
    width: 216px;
    height: 216px;

    @include for-mobile {
      width: 154px;
      height: 154px;
    }
  }
}

.products__product-card-horizontal {
  img.sf-image {
    width: 140px;
    height: 222px;

    @include for-mobile {
      width: 85px;
      height: 113px;
    }
  }
}
</style>

<template>
  <div id="my-account">
    <SfBreadcrumbs
      class="breadcrumbs desktop-only"
      :breadcrumbs="breadcrumbs"
    />

    <SfContentPages
      v-e2e="'my-account-content-pages'"
      :title="$t('My Account')"
      :active="activePage"
      :class="['my-account', activePageClass]"
      @click:change="changeActivePage"
    >
      <SfContentCategory :title="$t('Personal details')">
        <SfContentPage title="My profile" />
        <SfContentPage title="Shipping details" />
        <SfContentPage title="Billing details" />
        <SfContentPage title="My newsletter" />
      </SfContentCategory>

      <SfContentCategory :title="$t('Order details')">
        <SfContentPage title="Order history" />
      </SfContentCategory>

      <SfContentPage title="Log out" />

      <template>
        <NuxtChild />
      </template>
    </SfContentPages>
  </div>
</template>

<script>
import { SfBreadcrumbs, SfContentPages } from '@storefront-ui/vue';
import {
  computed,
  defineComponent,
  ref,
  useContext,
  useRoute,
  useRouter
} from '@nuxtjs/composition-api';
import { useUser } from '@/composables';
import MyProfile from './MyAccount/MyProfile';
import ShippingDetails from './MyAccount/ShippingDetails';
import BillingDetails from './MyAccount/BillingDetails';
import MyNewsletter from './MyAccount/MyNewsletter';
import OrderHistory from './MyAccount/OrderHistory';

export default defineComponent({
  name: 'MyAccount',
  components: {
    SfBreadcrumbs,
    SfContentPages,
    MyProfile,
    ShippingDetails,
    BillingDetails,
    MyNewsletter,
    OrderHistory
  },
  middleware: [
    'is-authenticated'
  ],
  setup() {
    const { i18n, localePath } = useContext();
    const route = useRoute();
    const router = useRouter();

    const { logout } = useUser();

    const isMobile = () => {
      if (typeof window === 'undefined') return false;
      const mediaQuery = window.matchMedia('(max-width: 1023px)');
      return mediaQuery.matches;
    };

    const changeActivePage = async (title) => {
      if (title === 'Log out') {
        await logout();
        router.push(localePath({ name: 'home' }));
        return;
      }

      const slugifiedTitle = (title || '').toLowerCase().replace(' ', '-');
      const transformedPath = `/my-account/${slugifiedTitle}`;
      const localeTransformedPath = localePath(transformedPath);

      router.push(localeTransformedPath);
    };

    const currentPage = computed(() => {
      const { path } = route.value;
      return path.split('/').pop();
    });

    const activePageClass = computed(() => currentPage.value === 'my-account' ? 'main' : currentPage.value);

    const activePage = computed(() => {
      const page = currentPage.value;

      if (page && page !== 'my-account') {
        return (
          page.charAt(0).toUpperCase() + page.slice(1)
        ).replace('-', ' ');
      } else {
        if (!isMobile()) {
          changeActivePage('My profile');
          return 'My profile';
        }

        return 'My account';
      }
    });

    const breadcrumbs = ref([
      {
        text: i18n.t('Home'),
        link: localePath({ name: 'home' })
      },
      {
        text: i18n.t('My Account'),
        link: localePath({ name: 'my-account' })
      },
      { text: i18n.t(activePage.value), link: '#' }
    ]);

    return { changeActivePage, activePage, activePageClass, breadcrumbs };
  }
});
</script>

<style lang="scss" scoped>
#my-account {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1240px;
    margin: 0 auto;
  }
}

.my-account {
  @include for-mobile {
    --content-pages-sidebar-category-title-font-weight: var(
        --font-weight--normal
    );
    --content-pages-sidebar-category-title-margin: var(--spacer-sm) var(--spacer-sm) var(--spacer-sm) var(--spacer-base);

    &.main {
      --content-pages-section-active-transform: translate3d(0, 0, 0);
    }
  }
  @include for-desktop {
    --content-pages-sidebar-category-title-margin: var(--spacer-xl) 0 0 0;
  }
}

.breadcrumbs {
  margin: var(--spacer-base) 0 var(--spacer-lg);
}
</style>

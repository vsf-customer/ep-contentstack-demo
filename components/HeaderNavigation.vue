<template>
  <div>
    <div class="sf-header__navigation desktop">
      <SfHeaderNavigationItem
        v-for="category in categories"
        :key="category.id"
        class="nav-item"
        v-e2e="`app-header-url_${getSlug(category)}`"
        :label="getName(category)"
        :link="localePath(`/c/${getSlug(category)}`)"
      />
    </div>
    <SfModal :visible="isMobileMenuOpen">
      <SfHeaderNavigationItem
        v-for="category in categories"
        :key="category.id"
        class="nav-item"
        v-e2e="`app-header-url_${category}`"
      >
        <template #mobile-navigation-item>
          <SfMenuItem
            :label="getName(category)"
            class="sf-header-navigation-item__menu-item"
            :link="localePath(`/c/${getSlug(category)}`)"
            @click.native="toggleMobileMenu"
          />
        </template>
      </SfHeaderNavigationItem>
    </SfModal>
  </div>
</template>

<script>
import { SfMenuItem, SfModal } from '@storefront-ui/vue';
import { defineComponent, useFetch } from '@nuxtjs/composition-api';
import { useUiState, useCategory, useCategoryData } from '@/composables';

export default defineComponent({
  name: 'HeaderNavigation',
  components: {
    SfMenuItem,
    SfModal
  },
  setup() {
    const { isMobileMenuOpen, toggleMobileMenu } = useUiState();

    const { getName, getSlug } = useCategoryData();
    const { categories, search } = useCategory();
    useFetch(async () => {
      await search({
        mainCategories: true
      });
    });

    return {
      getName,
      getSlug,
      categories,
      isMobileMenuOpen,
      toggleMobileMenu
    };
  }
});
</script>

<style lang="scss" scoped>
.sf-header-navigation-item {
  ::v-deep &__item--mobile {
    display: block;
  }
}
.sf-modal {
  ::v-deep &__bar {
    display: none;
  }
  ::v-deep &__content {
    padding: var(--modal-content-padding, var(--spacer-base) 0);
  }
}
</style>

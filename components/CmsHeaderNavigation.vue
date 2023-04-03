<template>
<div class="header-navigation">
  <div class="sf-header__navigation desktop-only">
    <SfHeaderNavigationItem
      v-for="(item, index) in header.navigation"
      :key="index"
      class="nav-item"
      v-e2e="`app-header-url_${item.caption}`"
      :label="item.caption"
      :link="localePath(item.link)"
    />
  </div>
  <SfModal class="smartphone-only" :visible="isMobileMenuOpen">
    <SfHeaderNavigationItem
      v-for="(item, index) in header.navigation"
      :key="index"
      class="nav-item"
      v-e2e="`app-header-url_${item.caption}`"
    >
      <template #mobile-navigation-item>
        <SfMenuItem
          :label="item.caption"
          class="sf-header-navigation-item__menu-item"
          :link="localePath(item.link)"
          @click="toggleMobileMenu"
        />
      </template>
    </SfHeaderNavigationItem>
  </SfModal>
</div>
</template>

<script>
import { SfMenuItem, SfModal } from '@storefront-ui/vue'
import { useUiState } from '~/composables'
import useCmsLayout from '~/composables/useCmsLayout'

export default {
  name: 'CmsHeaderNavigation',
  components: {
    SfMenuItem,
    SfModal,
  },
  setup() {
    const { isMobileMenuOpen, toggleMobileMenu } = useUiState()
    const { header } = useCmsLayout()

    return {
      header,
      isMobileMenuOpen,
      toggleMobileMenu,
    }
  },
}
</script>

<style lang="scss" scoped>
.sf-header-navigation-item {
  ::v-deep &__item--mobile {
    display: block;
  }
}
.sf-list__item {
  @include for-mobile {
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

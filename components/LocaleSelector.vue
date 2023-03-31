<template>
  <div class="container">
    <SfButton
      class="container__lang container__lang--selected"
      @click="isLangModalOpen = !isLangModalOpen"
    >
      <SfImage
        :src="langIconPath(locale)"
        :width="20"
        :height="20"
        alt="Flag"
        image-tag="nuxt-img"
      />
    </SfButton>
    <SfBottomModal
      :is-open="isLangModalOpen"
      @click:close="isLangModalOpen = !isLangModalOpen"
    >
      <SfHeading
        :level="3"
        :title="$t('Choose language')"
        class="sf-bottom-modal__title"
      />
      <SfList>
        <SfListItem v-for="lang in locales" :key="lang.code">
          <a :href="switchLocalePath(lang.code)">
            <SfCharacteristic class="language">
              <template #title>
                <span :class="{ active: lang.code === locale }">
                  {{ lang.label }}
                </span>
              </template>
              <template #icon>
                <SfImage
                  :src="langIconPath(lang.code)"
                  width="20"
                  :alt="`${lang.label} language flag`"
                  class="language__flag"
                  image-tag="nuxt-img"
                />
              </template>
            </SfCharacteristic>
          </a>
        </SfListItem>
      </SfList>

      <SfHeading
        :level="3"
        :title="$t('Choose currency')"
        class="sf-bottom-modal__title"
      />
      <SfList>
        <SfListItem v-for="currency in availableCurrencies" :key="currency.id">
          <button @click="handleCurrencyChange(currency.code)">
            <SfCharacteristic class="currency">
              <template #title>
                <span
                  :class="{ active: activeCurrency.code === currency.code }"
                >
                  {{ currency.code }}
                </span>
              </template>
              <template #icon>
                <SfImage
                  :src="currencyIconPath(currency)"
                  width="20"
                  height="20"
                  :alt="`${currency.code} currency image`"
                  class="currency__image"
                  image-tag="nuxt-img"
                />
              </template>
            </SfCharacteristic>
          </button>
        </SfListItem>
      </SfList>
    </SfBottomModal>
  </div>
</template>

<script>
import {
  SfImage,
  SfSelect,
  SfButton,
  SfList,
  SfBottomModal,
  SfCharacteristic,
  SfHeading,
  SfRadio
} from '@storefront-ui/vue';
import {
  ref,
  computed,
  defineComponent,
  useContext
} from '@nuxtjs/composition-api';
import { addBasePath } from '@vue-storefront/core';
import { useLocale } from '@/composables';

export default defineComponent({
  components: {
    SfImage,
    SfSelect,
    SfButton,
    SfList,
    SfBottomModal,
    SfCharacteristic,
    SfHeading,
    SfRadio
  },
  setup() {
    const {
      i18n: { locales, locale }
    } = useContext();
    const { currencies, activeCurrency, setActiveCurrency } = useLocale();

    const isLangModalOpen = ref(false);

    const availableCurrencies = computed(() =>
      currencies.value.filter((currency) => currency.enabled)
    );

    const handleCurrencyChange = (currencyCode) => {
      setActiveCurrency({
        currency: availableCurrencies.value.find(
          (currency) => currency.code === currencyCode
        )
      });
      isLangModalOpen.value = false;
    };

    const langIconPath = (locale) => addBasePath(`/icons/langs/${locale}.svg`);
    const currencyIconPath = (currency) =>
      addBasePath(`/icons/currencies/${currency.code}.svg`);

    return {
      locales,
      availableCurrencies,
      activeCurrency,
      handleCurrencyChange,
      locale,
      isLangModalOpen,
      addBasePath,
      currencyIconPath,
      langIconPath
    };
  }
});
</script>

<style lang="scss" scoped>
.container {
  margin: 0 -5px;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  position: relative;
  .sf-bottom-modal {
    z-index: 2;
    left: 0;
    @include for-desktop {
      --bottom-modal-height: 100vh;
    }
  }
  .sf-bottom-modal::v-deep .sf-bottom-modal__close {
    position: var(--circle-icon-position, absolute);
    top: var(--spacer-xs);
    right: var(--spacer-xs);
  }
  .sf-list {
    button {
      background: 0;
      border: 0;
      cursor: pointer;
      font: var(
        --list-item-font,
        var(--list-item-font-weight, var(--font-weight--normal))
          var(--list-item-font-size, var(--font-size--base)) /
          var(--list-item-font-line-height, 1.4)
          var(--list-item-font-family, var(--font-family--secondary))
      );
      padding: 0;
    }
    .language {
      padding: var(--spacer-sm);
      &__flag {
        margin-right: var(--spacer-sm);
      }
      .active {
        font-weight: bold;
      }
    }
    .currency {
      padding: var(--spacer-sm);
      &__image {
        margin-right: var(--spacer-sm);
      }
      .active {
        font-weight: bold;
      }
    }
    @include for-desktop {
      display: flex;
    }
  }
  &__lang {
    width: 20px;
    --button-box-shadow: none;
    background: none;
    padding: 0 5px;
    display: flex;
    align-items: center;
    opacity: 0.5;
    border: none;
    &:hover,
    &--selected {
      opacity: 1;
    }
  }
}
</style>

import { computed, useContext } from '@nuxtjs/composition-api';
import { useLocaleStore } from '@/store/locale';
import {
  forceLoginOnUnauthorizedResponse,
  isApiError
} from '@/helpers/general';
import type { UseLocale, UseLocaleSetActiveCurrencyParams } from './types';
import { configDefault } from '@/modules/epcc/config/default';
import { Logger } from '@vue-storefront/core';

export const currencyCookieOptions = {
  path: '/',
  sameSite: 'lax',
  // Year from now
  expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
} as const;

/**
 * @public
 *
 * The `useLocale` composable allows loading currencies from Elastic Path API.
 * It is commonly used in locale selector and refs for the price formatter.
 */
export function useLocale(): UseLocale {
  const {
    $cookies,
    $vsf: { $epcc }
  } = useContext();

  const store = useLocaleStore();

  const load = async () => {
    try {
      store.loading = true;

      const currencyCookie = $cookies.get(configDefault.cookies.currencyCookieName);

      const allCurrencies = await $epcc.api.getCurrencies();

      store.currencies = allCurrencies.filter((currency) => currency.enabled);
      store.activeCurrency =
        (currencyCookie &&
          store.currencies.find(
            (currency) => currency.code === currencyCookie
          )) ??
        store.currencies.find((currency) => currency.default) ??
        store.currencies[0];
      store.error.load = null;

      if (currencyCookie !== store.activeCurrency.code) {
        $cookies.set(
          configDefault.cookies.currencyCookieName,
          store.activeCurrency.code,
          currencyCookieOptions
        );
      }

      return store.currencies;
    } catch (err) {
      Logger.error('useLocale/load', err);

      store.error.load = err;

      if (isApiError(err)) {
        await forceLoginOnUnauthorizedResponse(err);
      }
    } finally {
      store.loading = false;
    }
  };

  const setActiveCurrency = ({
    currency
  }: UseLocaleSetActiveCurrencyParams) => {
    store.activeCurrency = currency;

    $cookies.set(
      configDefault.cookies.currencyCookieName,
      store.activeCurrency.code,
      currencyCookieOptions
    );
  };

  return {
    activeCurrency: computed(() => store.activeCurrency),
    currencies: computed(() => store.currencies),
    error: computed(() => store.error),
    loading: computed(() => store.loading),
    load,
    setActiveCurrency
  };
}

export * from './types';

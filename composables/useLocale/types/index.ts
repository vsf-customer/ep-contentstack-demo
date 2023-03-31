import { Currency } from '@vsf-enterprise/epcc-api';
import { ComputedRef } from '@nuxtjs/composition-api';

interface UseLocaleErrors {
  load: Error;
}

export interface UseLocaleSetActiveCurrencyParams {
  currency: Currency;
}

export interface UseLocale {
  activeCurrency: ComputedRef<Currency | null>;
  currencies: ComputedRef<Currency[]>;
  loading: ComputedRef<boolean>;
  error: ComputedRef<UseLocaleErrors>;
  load(): Promise<Currency[]>;
  setActiveCurrency(params: UseLocaleSetActiveCurrencyParams): void;
}

import type { Currency } from '@vsf-enterprise/epcc-api';

export interface UseLocaleStoreErrors {
  load: Error;
}

export interface UseLocaleStoreState {
  activeCurrency: Currency;
  currencies: Currency[];
  loading: boolean;
  error: UseLocaleStoreErrors;
}

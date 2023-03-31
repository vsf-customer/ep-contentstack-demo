import { useContext } from '@nuxtjs/composition-api';
import { Currency } from '@vsf-enterprise/epcc-api';

export const currencyFormatter = (currency?: Currency): Intl.NumberFormat => {
  const { i18n, $config } = useContext();

  return new Intl.NumberFormat(i18n.locale, {
    style: 'currency',
    currency: currency?.code ?? $config.theme?.fallbackCurrency,

    // These options are needed to round to whole numbers if that's what you want.
    maximumFractionDigits: currency?.decimal_places ?? 2,
    minimumFractionDigits: currency?.decimal_places ?? 2
  });
};

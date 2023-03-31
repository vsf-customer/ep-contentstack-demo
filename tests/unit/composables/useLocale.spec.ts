import { expect } from '@jest/globals';
import { setActivePinia } from 'pinia';
import { createTestingPinia } from '@pinia/testing';
import { useLocale } from '@/composables';
import { currenciesMock } from '@/tests/__mocks__/currencies.mock';
import { configDefault } from '@/modules/epcc/config/default';
import { currencyCookieOptions } from '@/composables/useLocale';

const ctx = {
  $cookies: {
    get: jest.fn(),
    set: jest.fn()
  },
  $vsf: {
    $epcc: {
      api: {
        getCurrencies: jest.fn()
      }
    }
  }
};

jest.mock('@nuxtjs/composition-api', () => ({
  ...jest.requireActual('@nuxtjs/composition-api'),
  useContext: () => ctx
}));

describe('[epcc-theme] useLocale', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setActivePinia(createTestingPinia());
  });

  describe('load', () => {
    describe('happy path', () => {
      beforeEach(async () => {
        ctx.$vsf.$epcc.api.getCurrencies.mockResolvedValue(currenciesMock);
      });

      it('should load the available currencies and set the active to the default one', async () => {
        // arrange
        const { load, currencies, activeCurrency, error } = useLocale();

        const defaultCurrency = currenciesMock.find(
          (currency) => currency.enabled
        );

        // act
        const loadedCurrencies = await load();

        // assert
        expect(error.value.load).toBeNull();
        expect(currencies.value).toStrictEqual(loadedCurrencies);
        expect(activeCurrency.value).toStrictEqual(defaultCurrency);
        expect(ctx.$vsf.$epcc.api.getCurrencies).toHaveBeenCalledTimes(1);
        expect(ctx.$cookies.set).toHaveBeenCalledWith(
          configDefault.cookies.currencyCookieName,
          defaultCurrency.code,
          currencyCookieOptions
        );
      });

      it('should filter out the disabled currencies', async () => {
        // arrange
        const { load, currencies, error } = useLocale();

        const enabledCurrencies = [currenciesMock[0], currenciesMock[1]];

        ctx.$vsf.$epcc.api.getCurrencies.mockResolvedValueOnce([
          ...enabledCurrencies,
          { ...currenciesMock[2], enabled: false }
        ]);

        // act
        await load();

        // assert
        expect(error.value.load).toBeNull();
        expect(currencies.value).toStrictEqual(enabledCurrencies);
        expect(ctx.$vsf.$epcc.api.getCurrencies).toHaveBeenCalledTimes(1);
      });

      it('should use the default currency if cookie does not exist', async () => {
        // arrange
        const expectedCurrency = currenciesMock[0];
        const { load, activeCurrency, error } = useLocale();

        ctx.$cookies.get.mockReturnValueOnce('default');

        // act
        await load();

        // assert
        expect(error.value.load).toBeNull();
        expect(activeCurrency.value).toStrictEqual(expectedCurrency);
        expect(ctx.$cookies.get).toHaveBeenCalledTimes(1);
        expect(ctx.$cookies.set).toHaveBeenCalledTimes(1);
      });

      it('should use the currency read from the cookie if cookie exists', async () => {
        // arrange
        const expectedCurrency = currenciesMock[2];
        const { load, activeCurrency, error } = useLocale();

        ctx.$cookies.get
          .mockReturnValueOnce(expectedCurrency.code);

        // act
        await load();

        // assert
        expect(error.value.load).toBeNull();
        expect(activeCurrency.value).toStrictEqual(expectedCurrency);
        expect(ctx.$cookies.get).toHaveBeenCalledTimes(1);
        expect(ctx.$cookies.set).toHaveBeenCalledTimes(0);
      });
    });

    describe('unhappy path', () => {
      it('should set the error when getCurrencies throws', async () => {
        // arrange
        const { load, error } = useLocale();
        const expectedError = 'could not get currencies';

        ctx.$vsf.$epcc.api.getCurrencies.mockRejectedValue(
          new Error(expectedError)
        );

        // act
        await load();

        // assert
        expect(error.value.load.message).toBe(expectedError);
      });
    });
  });

  describe('setActiveCurrency', () => {
    it('should change the active currency and set the currency cookie', () => {
      const newActiveCurrency = currenciesMock[1];

      const { setActiveCurrency, activeCurrency } = useLocale();

      expect(activeCurrency.value).toStrictEqual(null);

      setActiveCurrency({ currency: newActiveCurrency });

      expect(activeCurrency.value).toStrictEqual(newActiveCurrency);

      expect(ctx.$cookies.set).toHaveBeenCalledTimes(1);
      expect(ctx.$cookies.set).toHaveBeenCalledWith(
        configDefault.cookies.currencyCookieName,
        newActiveCurrency.code,
        currencyCookieOptions
      );
    });
  });
});

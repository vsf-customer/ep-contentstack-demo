import { expect } from '@jest/globals';
import { useShippingProvider } from '@/composables';
import { ContextualizedEndpoints } from '@vsf-enterprise/epcc-api';
import { themeConfigMock } from '@/tests/__mocks__/themeConfig.mock';
import { shippingProviderMock } from '@/tests/__mocks__/shippingProvider.mock';

const ctx = {
  $vsf: {
    $epcc: {
      api: {} as Partial<ContextualizedEndpoints>
    }
  },
  $config: themeConfigMock
};

jest.mock('@nuxtjs/composition-api', () => ({
  ...jest.requireActual('@nuxtjs/composition-api'),
  useContext: () => ctx
}));

describe('[epcc-theme] useShippingProvider', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('action: load', () => {
    it('should load providers from API', async () => {
      ctx.$vsf.$epcc.api.getAllEntries = jest.fn(() => Promise.resolve(shippingProviderMock));

      const { load, error, loading, state } = useShippingProvider();

      await load();

      expect(ctx.$vsf.$epcc.api.getAllEntries).toHaveBeenCalledTimes(1);
      expect(error.value.load).toBe(null);
      expect(state.value).toBe(shippingProviderMock);
      expect(loading.value).toBe(false);
    });

    it('should throw an error when api fails', async () => {
      ctx.$vsf.$epcc.api.getAllEntries = jest.fn(() => Promise.reject());

      const { load, error, loading, state } = useShippingProvider();

      await load();

      expect(error.value.load).not.toBe(null);
      expect(state.value).toBe(null);
      expect(loading.value).toBe(false);
    });
  });
});

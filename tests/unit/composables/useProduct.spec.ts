import { expect } from '@jest/globals';
import { useProduct } from '@/composables';
import { productMock } from '@/tests/__mocks__/product.mock';
import { GetProductParams } from '@vsf-enterprise/epcc-api';

const ctx = {
  $vsf: {
    $epcc: {
      api: {
        getProduct: jest.fn()
      }
    }
  }
};

jest.mock('@nuxtjs/composition-api', () => ({
  ...jest.requireActual('@nuxtjs/composition-api'),
  useContext: () => ctx
}));

describe('[epcc-theme] useProduct', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('search', () => {
    describe('happy path', () => {
      it('should return a product', async () => {
        // arrange
        const params: GetProductParams = {
          id: '1',
          locale: 'en-US',
          withInventory: true,
          withConnectedProducts: true
        };
        const { search, product, error, loading } = useProduct(params.id);
        ctx.$vsf.$epcc.api.getProduct.mockResolvedValue(productMock);

        // act
        const response = await search(params);

        // assert
        expect(loading.value).toBeFalsy();
        expect(error.value.search).toBeNull();
        expect(response).toEqual(productMock);
        expect(product.value).toEqual(productMock);
        expect(ctx.$vsf.$epcc.api.getProduct).toHaveBeenCalledWith(params);
      });
    });

    describe('unhappy path', () => {
      it('should handle gracefully when getting a product and the API throws', async () => {
        // arrange
        const params: GetProductParams = { id: '1' };
        const { search, product, error, loading } = useProduct(params.id);
        ctx.$vsf.$epcc.api.getProduct.mockRejectedValue(new Error('API error'));

        // act
        const response = await search(params);

        // assert
        expect(response).toBeUndefined();
        expect(product.value).toBeNull();
        expect(loading.value).toBeFalsy();
        expect(error.value.search.message).toBe('API error');
        expect(ctx.$vsf.$epcc.api.getProduct).toHaveBeenCalledWith(params);
      });
    });
  });

  describe('clear', () => {
    it('should clear the product', async () => {
      // arrange
      const params: GetProductParams = {
        id: '1'
      };
      const { search, clear, product } = useProduct(params.id);
      ctx.$vsf.$epcc.api.getProduct.mockResolvedValue(productMock);

      // act
      await search(params);

      // assert
      expect(product.value).toEqual(productMock);
      expect(ctx.$vsf.$epcc.api.getProduct).toHaveBeenCalledWith(params);

      // clear
      clear();

      // assert
      expect(product.value).toEqual(null);
    });
  });
});

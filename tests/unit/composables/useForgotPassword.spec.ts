import { expect } from '@jest/globals';
import { useForgotPassword } from '@/composables';
import { ContextualizedEndpoints } from '@vsf-enterprise/epcc-api';

const ctx = {
  $vsf: {
    $epcc: {
      api: {} as Partial<ContextualizedEndpoints>
    }
  }
};

jest.mock('@nuxtjs/composition-api', () => ({
  ...jest.requireActual('@nuxtjs/composition-api'),
  useContext: () => ctx
}));

describe('[epcc-theme] useForgotPassword', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('resetPassword', () => {
    const params = { email: 'test@test.com' };

    it('should reset password', async () => {
      ctx.$vsf.$epcc.api.resetPassword = jest.fn(() => Promise.resolve());

      const { request, error, loading } = useForgotPassword();
      const response = await request(params);

      expect(response).toBe(void 0);
      expect(ctx.$vsf.$epcc.api.resetPassword).toHaveBeenCalledTimes(1);
      expect(ctx.$vsf.$epcc.api.resetPassword).toHaveBeenCalledWith({
        email: params.email
      });
      expect(error.value.request).toBe(null);
      expect(loading.value).toBe(false);
    });

    it('should throw an error when api fails', async () => {
      ctx.$vsf.$epcc.api.resetPassword = jest.fn(() => Promise.reject());

      const { request, error, loading } = useForgotPassword();
      await request(params);

      expect(error.value.request).not.toBe(null);
      expect(loading.value).toBe(false);
    });
  });

  describe('setNewPassword', () => {
    const params = {
      tokenValue: 'token123',
      newPassword: 'password',
      customQuery: { email: 'test@test.com' },
      currentResult: null
    };

    it('should set new password', async () => {
      ctx.$vsf.$epcc.api.setNewPassword = jest.fn(() => Promise.resolve());

      const { setNew, error, loading } = useForgotPassword();
      const response = await setNew(params);

      expect(response).toBe(void 0);
      expect(ctx.$vsf.$epcc.api.setNewPassword).toHaveBeenCalledTimes(1);
      expect(ctx.$vsf.$epcc.api.setNewPassword).toHaveBeenCalledWith({
        email: params.customQuery.email,
        token: params.tokenValue,
        newPassword: params.newPassword
      });

      expect(error.value.setNew).toBe(null);
      expect(loading.value).toBe(false);
    });

    it('should throw an error when api fails', async () => {
      ctx.$vsf.$epcc.api.setNewPassword = jest.fn(() => Promise.reject());

      const { setNew, error, loading } = useForgotPassword();
      await setNew(params);

      expect(error.value.setNew).not.toBe(null);
      expect(loading.value).toBe(false);
    });
  });
});

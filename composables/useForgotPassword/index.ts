import type {
  UseForgotPassword,
  UseForgotPasswordErrors,
  UseForgotPasswordSetNew
} from './types';
import { computed, Ref, ref, useContext } from '@nuxtjs/composition-api';
import type { UseForgotPasswordRequest } from '@/composables/useForgotPassword/types';

/**
 * @public
 *
 * The `useForgotPassword` composable allows to interact on every single password
 * action on Elastic Path API. It is commonly used in to reset and set new password
 * Provides the load function and refs for the categories, loading, and error.
 */
export function useForgotPassword(): UseForgotPassword {
  const {
    $vsf: { $epcc }
  } = useContext();
  const loading = ref(false);
  const error: Ref<UseForgotPasswordErrors> = ref({
    setNew: null,
    request: null
  });

  const request: UseForgotPasswordRequest = async (params) => {
    const { email } = params;
    try {
      loading.value = true;

      await $epcc.api.resetPassword({ email });

      error.value.request = null;
    } catch (err) {
      error.value.request = err;
    } finally {
      loading.value = false;
    }
  };

  const setNew: UseForgotPasswordSetNew = async (params) => {
    const { tokenValue: token, newPassword, customQuery } = params;
    try {
      loading.value = true;

      await $epcc.api.setNewPassword({
        token,
        newPassword,
        email: customQuery?.email
      });

      error.value.setNew = null;
    } catch (err) {
      error.value.setNew = err;
    } finally {
      loading.value = false;
    }
  };

  return {
    setNew,
    request,
    error: computed(() => error.value),
    loading: computed(() => loading.value)
  };
}

export * from './types';

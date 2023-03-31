<template>
  <ValidationObserver v-slot="{ handleSubmit, reset }">
    <form class="form" @submit.prevent="handleSubmit(submitForm(reset))">
      <SfLoader
        :class="{ loader: loading }"
        :loading="loading"
        class="form__wrapper-loader"
      >
        <div>
          <ValidationProvider
            v-slot="{ errors }"
            rules="required"
            class="form__element"
          >
            <SfInput
              v-model="form.currentPassword"
              type="password"
              name="currentPassword"
              :label="$t('Current Password')"
              required
              :valid="!errors[0]"
              :error-message="errors[0]"
            />
          </ValidationProvider>
          <div class="form__horizontal">
            <ValidationProvider
              v-slot="{ errors }"
              rules="required|password"
              vid="password"
              class="form__element"
            >
              <SfInput
                v-model="form.newPassword"
                type="password"
                name="newPassword"
                :label="$t('New Password')"
                required
                :valid="!errors[0]"
                :error-message="errors[0]"
              />
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ errors }"
              rules="required|confirmed:password"
              class="form__element"
            >
              <SfInput
                v-model="form.repeatPassword"
                type="password"
                name="repeatPassword"
                :label="$t('Repeat Password')"
                required
                :valid="!errors[0]"
                :error-message="errors[0]"
                @keypress.enter="handleSubmit(submitForm(reset))"
              />
            </ValidationProvider>
          </div>
          <div v-if="error.authentication" class="form__error-message">
            {{ error.authentication }}
          </div>
          <SfButton class="form__button" type="submit">
            {{ $t('Update password') }}
          </SfButton>
        </div>
      </SfLoader>
    </form>
  </ValidationObserver>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  useContext
} from '@nuxtjs/composition-api';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { SfInput, SfButton, SfLoader } from '@storefront-ui/vue';
import { useUser } from '@/composables';
import { useUserData } from '../../composables/useUserData';

export default defineComponent({
  name: 'PasswordResetForm',
  components: {
    SfInput,
    SfButton,
    SfLoader,
    ValidationProvider,
    ValidationObserver
  },
  setup(_, { emit }) {
    const { getEmailAddress } = useUserData();
    const { user, error: userError, loading } = useUser();
    const { i18n } = useContext();

    const resetForm = () => ({
      email: getEmailAddress(user.value),
      currentPassword: '',
      newPassword: '',
      repeatPassword: ''
    });
    const error = reactive({
      authentication: null
    });
    const form = ref(resetForm());
    const submitForm = (resetValidationFn) => () => {
      error.authentication = null;
      const onComplete = () => {
        if (userError.value?.changePassword) {
          error.authentication = i18n.t('Invalid credentials');
        } else {
          form.value = resetForm();
          resetValidationFn();
        }
      };

      const onError = () => {
        error.authentication = i18n.t('Password change failed.');
      };

      emit('submit', { form, onComplete, onError });
    };

    return {
      form,
      error,
      loading,
      submitForm
    };
  }
});
</script>

<style lang="scss" scoped>
.form {
  &__element {
    display: block;
    margin: 0 0 var(--spacer-lg) 0;
  }
  &__error-message {
    color: var(--input-error-message-color, var(--c-danger));
    margin-bottom: 0.2rem;
  }
  &__button {
    display: block;
    width: 100%;
    @include for-desktop {
      width: 17.5rem;
    }
  }
  &__horizontal {
    @include for-desktop {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    .form__element {
      @include for-desktop {
        flex: 1;
        margin-right: var(--spacer-lg);
      }
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>

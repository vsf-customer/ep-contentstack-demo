<template>
  <ValidationObserver v-slot="{ handleSubmit, reset }">
    <form class="form" @submit.prevent="handleSubmit(submitForm(reset))">
      <SfLoader
        :class="{ loader: loading }"
        :loading="loading"
        class="form__wrapper-loader"
      >
        <div>
          <div class="form__horizontal">
            <ValidationProvider
              v-slot="{ errors }"
              rules="required|max:100"
              class="form__element"
            >
              <SfInput
                v-model="form.firstName"
                name="firstName"
                :label="$t('First name')"
                required
                :valid="!errors[0]"
                :error-message="errors[0]"
              />
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ errors }"
              rules="required|max:100"
              class="form__element"
            >
              <SfInput
                v-model="form.lastName"
                name="lastName"
                :label="$t('Last name')"
                required
                :valid="!errors[0]"
                :error-message="errors[0]"
              />
            </ValidationProvider>
          </div>
          <ValidationProvider
            v-slot="{ errors }"
            rules="required|email|max:100"
            class="form__element"
          >
            <SfInput
              v-model="form.email"
              name="email"
              :label="$t('Your email')"
              required
              :valid="!errors[0]"
              :error-message="errors[0]"
            />
          </ValidationProvider>
        </div>
      </SfLoader>

      <SfModal
        :visible="requirePassword"
        :title="$t('Attention!')"
        cross
        persistent
        @close="
          () => {
            currentPassword = '';
            requirePassword = false;
          }
        "
      >
        <p>
          {{
            $t(
              'Please type your current password to change your personal details.'
            )
          }}
        </p>

        <ValidationProvider
          v-slot="{ errors }"
          rules="required|min:2|max:100"
          class="form__element"
        >
          <SfInput
            v-model="currentPassword"
            type="password"
            name="currentPassword"
            :label="$t('Current Password')"
            required
            class="form__element"
            style="margin-top: 10px"
            @keypress.enter="handleSubmit(submitForm(reset))"
            :valid="!errors[0]"
            :error-message="errors[0]"
          />
        </ValidationProvider>

        <div v-if="error.authentication" class="form__error-message">
          {{ error.authentication }}
        </div>
        <SfButton class="form__button" :disabled="loading" type="submit">
          <SfLoader :class="{ loader: loading }" :loading="loading">
            <span>
              {{ $t('Update personal data') }}
            </span>
          </SfLoader>
        </SfButton>
      </SfModal>
      <SfButton class="form__button" type="submit">
        {{ $t('Update personal data') }}
      </SfButton>
    </form>
  </ValidationObserver>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  watch,
  useContext
} from '@nuxtjs/composition-api';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { email } from 'vee-validate/dist/rules';
import { SfButton, SfInput, SfLoader, SfModal } from '@storefront-ui/vue';
import { useUser } from '@/composables';
import { useUserData } from '../../composables/useUserData';

export default defineComponent({
  name: 'ProfileUpdateForm',
  components: {
    SfInput,
    SfButton,
    SfLoader,
    SfModal,
    ValidationProvider,
    ValidationObserver
  },
  emits: ['submit'],
  setup(props, { emit }) {
    const userData = useUserData();
    const { user, loading, error: userError } = useUser();
    const currentPassword = ref('');
    const { i18n } = useContext();
    const requirePassword = ref(false);
    const error = reactive({
      authentication: null
    });
    const resetForm = () => ({
      firstName: userData.getFirstName(user.value),
      lastName: userData.getLastName(user.value),
      email: userData.getEmailAddress(user.value)
    });
    const form = ref<{
      firstName: string;
      lastName: string;
      email: string;
      password?: string;
    }>(resetForm());
    const submitForm = (resetValidationFn) => () => {
      error.authentication = null;
      requirePassword.value = true;

      const onComplete = () => {
        if (userError.value?.updateUser) {
          error.authentication = i18n.t('Invalid credentials');
          requirePassword.value = true;
        } else {
          requirePassword.value = false;
          currentPassword.value = '';
          resetValidationFn();
        }
      };

      const onError = () => {
        form.value = resetForm();
        requirePassword.value = false;
        currentPassword.value = '';
      };

      if (currentPassword.value) {
        form.value.password = currentPassword.value;
        emit('submit', { form, onComplete, onError });
      }
    };

    extend('email', {
      ...email,
      message: i18n.t('Invalid email.').toString()
    });

    watch(user, async () => {
      if (user.value?.id) {
        form.value = resetForm();
      }
    });

    return {
      requirePassword,
      currentPassword,
      form,
      user,
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
  &__button {
    display: block;
    width: 100%;
    @include for-desktop {
      width: 17.5rem;
    }
  }
  &__wrapper-loader {
    min-height: 20vh;
  }
  &__error-message {
    color: var(--input-error-message-color, var(--c-danger));
    margin-bottom: 0.2rem;
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
        margin-right: var(--spacer-2xl);
      }
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>

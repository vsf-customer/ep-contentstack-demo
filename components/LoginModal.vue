<template>
  <SfModal
    v-e2e="'login-modal'"
    :visible="isLoginModalOpen"
    class="modal"
    @close="closeModal"
  >
    <template #modal-bar>
      <SfBar
        class="sf-modal__bar smartphone-only"
        :close="true"
        :title="$t(barTitle)"
        @click:close="closeModal"
      />
    </template>
    <transition name="sf-fade" mode="out-in">
      <div v-if="currentScreen === SCREEN_LOGIN">
        <ValidationObserver v-slot="{ handleSubmit }" key="log-in">
          <form class="form" @submit.prevent="handleSubmit(handleLogin)">
            <ValidationProvider rules="required|email" v-slot="{ errors }">
              <SfInput
                v-e2e="'login-modal-email'"
                v-model="form.username"
                :valid="!errors[0]"
                :errorMessage="errors[0]"
                name="email"
                :label="$t('Your email')"
                class="form__element"
              />
            </ValidationProvider>
            <ValidationProvider rules="required" v-slot="{ errors }">
              <SfInput
                v-e2e="'login-modal-password'"
                v-model="form.password"
                :valid="!errors[0]"
                :errorMessage="errors[0]"
                name="password"
                :label="$t('Password')"
                type="password"
                class="form__element"
              />
            </ValidationProvider>
            <SfCheckbox
              v-e2e="'login-modal-remember-me'"
              v-model="rememberMe"
              name="remember-me"
              :label="$t('Remember me')"
              class="form__element checkbox"
            />
            <div v-if="error.login">
              {{ error.login }}
            </div>
            <SfButton
              v-e2e="'login-modal-submit'"
              type="submit"
              class="sf-button--full-width form__button"
              :disabled="loading"
            >
              <SfLoader :class="{ loader: loading }" :loading="loading">
                <div>{{ $t('Login') }}</div>
              </SfLoader>
            </SfButton>
          </form>
        </ValidationObserver>
        <div class="action">
          <SfButton
            class="sf-button--text"
            @click="setCurrentScreen(SCREEN_FORGOTTEN)"
          >
            {{ $t('Forgotten password?') }}
          </SfButton>
        </div>
        <div class="bottom">
          <p class="bottom__paragraph">{{ $t('No account') }}</p>
          <SfButton
            class="sf-button--text"
            @click="setCurrentScreen(SCREEN_REGISTER)"
          >
            {{ $t('Register today') }}
          </SfButton>
        </div>
      </div>
      <div v-else-if="currentScreen === SCREEN_FORGOTTEN">
        <p>{{ $t('Forgot Password') }}</p>
        <ValidationObserver v-slot="{ handleSubmit }" key="log-in">
          <form class="form" @submit.prevent="handleSubmit(handleForgotten)">
            <ValidationProvider
              rules="required|email|max:100"
              v-slot="{ errors }"
            >
              <SfInput
                v-e2e="'forgot-modal-email'"
                v-model="form.username"
                :valid="!errors[0]"
                :errorMessage="errors[0]"
                name="email"
                :label="$t('Forgot Password Modal Email')"
                class="form__element"
              />
            </ValidationProvider>
            <div v-if="forgotPasswordError.request">
              {{ forgotPasswordError.request.message }}
            </div>
            <SfButton
              v-e2e="'forgot-modal-submit'"
              type="submit"
              class="sf-button--full-width form__button"
              :disabled="forgotPasswordLoading"
            >
              <SfLoader
                :class="{ loader: forgotPasswordLoading }"
                :loading="forgotPasswordLoading"
              >
                <div>{{ $t('Reset Password') }}</div>
              </SfLoader>
            </SfButton>
          </form>
        </ValidationObserver>
      </div>
      <div v-else-if="currentScreen === SCREEN_THANK_YOU" class="thank-you">
        <i18n
          tag="p"
          class="thank-you__paragraph"
          path="forgotPasswordConfirmation"
        >
          <span class="thank-you__paragraph--bold">{{ userEmail }}</span>
        </i18n>
        <p class="thank-you__paragraph">{{ $t('Thank You Inbox') }}</p>

        <!-- TODO: Delete this once password reset link emailing have been developed -->
        <p v-if="passwordResetLink" class="thank-you__paragraph">
          <a :href="passwordResetLink">{{
            $t('Click here to reset your password')
          }}</a>
        </p>
      </div>
      <div v-else class="form">
        <ValidationObserver v-slot="{ handleSubmit }" key="sign-up">
          <form
            class="form"
            @submit.prevent="handleSubmit(handleRegister)"
            autocomplete="off"
          >
            <ValidationProvider
              rules="required|email|max:100"
              v-slot="{ errors }"
            >
              <SfInput
                v-e2e="'login-modal-email'"
                v-model="form.email"
                :valid="!errors[0]"
                :errorMessage="errors[0]"
                name="email"
                :label="$t('Your email')"
                class="form__element"
              />
            </ValidationProvider>
            <ValidationProvider rules="required|max:100" v-slot="{ errors }">
              <SfInput
                v-e2e="'login-modal-firstName'"
                v-model="form.firstName"
                :valid="!errors[0]"
                :errorMessage="errors[0]"
                name="first-name"
                :label="$t('First name')"
                class="form__element"
              />
            </ValidationProvider>
            <ValidationProvider rules="required|max:100" v-slot="{ errors }">
              <SfInput
                v-e2e="'login-modal-lastName'"
                v-model="form.lastName"
                :valid="!errors[0]"
                :errorMessage="errors[0]"
                name="last-name"
                :label="$t('Last name')"
                class="form__element"
              />
            </ValidationProvider>
            <ValidationProvider
              rules="required|password"
              vid="password"
              v-slot="{ errors }"
            >
              <SfInput
                v-e2e="'login-modal-password'"
                v-model="form.password"
                :valid="!errors[0]"
                :errorMessage="errors[0]"
                name="password"
                :label="$t('Password')"
                type="password"
                class="form__element"
              />
            </ValidationProvider>
            <ValidationProvider
              :rules="{ required: { allowFalse: false } }"
              v-slot="{ errors }"
            >
              <SfCheckbox
                v-e2e="'login-modal-create-account'"
                v-model="createAccount"
                :valid="!errors[0]"
                :errorMessage="errors[0]"
                name="create-account"
                :label="$t('I want to create an account')"
                class="form__element"
              />
            </ValidationProvider>
            <SfCheckbox
              v-model="acceptsMarketingEmails"
              name="accept-marketing-emails"
              :label="$t('I want to receive marketing emails')"
              class="form__element"
            />
            <div v-if="error.register">
              {{ error.register }}
            </div>
            <SfButton
              v-e2e="'login-modal-submit'"
              type="submit"
              class="sf-button--full-width form__button"
              :disabled="loading"
            >
              <SfLoader :class="{ loader: loading }" :loading="loading">
                <div>{{ $t('Create an account') }}</div>
              </SfLoader>
            </SfButton>
          </form>
        </ValidationObserver>
        <div class="action">
          {{ $t('or') }}
          <SfButton
            class="sf-button--text"
            @click="setCurrentScreen(SCREEN_LOGIN)"
          >
            {{ $t('login in to your account') }}
          </SfButton>
        </div>
      </div>
    </transition>
  </SfModal>
</template>

<script>
import {
  ref,
  watch,
  reactive,
  computed,
  defineComponent,
  useContext,
  useRouter
} from '@nuxtjs/composition-api';
import {
  SfModal,
  SfInput,
  SfButton,
  SfCheckbox,
  SfLoader,
  SfAlert,
  SfBar
} from '@storefront-ui/vue';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required, email, max, min } from 'vee-validate/dist/rules';
import { useUiState, useUser, useForgotPassword, useUiNotification } from '@/composables';

export default defineComponent({
  name: 'LoginModal',
  components: {
    SfModal,
    SfInput,
    SfButton,
    SfCheckbox,
    SfLoader,
    SfAlert,
    ValidationProvider,
    ValidationObserver,
    SfBar
  },
  setup() {
    const { isLoginModalOpen, toggleLoginModal } = useUiState();
    const { localePath, i18n } = useContext();
    const { send } = useUiNotification();
    const router = useRouter();
    const form = ref({
      username: '',
      password: '',
      email: '',
      firstName: '',
      lastName: '',
      acceptsMarketingEmails: false
    });
    const SCREEN_LOGIN = 'login';
    const SCREEN_REGISTER = 'register';
    const SCREEN_THANK_YOU = 'thankYouAfterForgotten';
    const SCREEN_FORGOTTEN = 'forgottenPassword';
    const isLogin = ref(true);
    const isForgotten = ref(false);
    const isThankYouAfterForgotten = ref(false);
    const userEmail = ref('');
    const createAccount = ref(false);
    const rememberMe = ref(false);
    const acceptsMarketingEmails = ref(false);
    const {
      register,
      login,
      loading,
      error: userError,
      isAuthenticated
    } = useUser();
    const {
      result,
      request,
      error: forgotPasswordError,
      loading: forgotPasswordLoading
    } = useForgotPassword();
    const currentScreen = ref(SCREEN_REGISTER);
    const passwordResetLink = ref('');

    const error = reactive({
      login: null,
      register: null
    });

    const resetErrorValues = () => {
      error.login = null;
      error.register = null;
    };

    const barTitle = computed(() => {
      switch (currentScreen.value) {
        case SCREEN_LOGIN:
          return 'Sign in';
        case SCREEN_REGISTER:
          return 'Register';
        default:
          return 'Reset Password';
      }
    });

    extend('email', {
      ...email,
      message: i18n.t('Invalid email.')
    });

    extend('required', {
      ...required,
      message: i18n.t('This field is required.')
    });

    extend('password', {
      validate: (value) =>
        String(value).length >= 8 &&
        String(value).match(/[A-Za-z]/gi) &&
        String(value).match(/[0-9]/gi),
      message:
        'Password must have at least 8 characters including one letter and a number'
    });

    extend('max', {
      ...max,
      message: i18n.t('Maximum length allowed for this field is exceeded.')
    });

    extend('min', {
      ...min,
      message: i18n.t('Minimum length allowed for this field is not met.')
    });

    watch(isLoginModalOpen, () => {
      if (isLoginModalOpen) {
        form.value = {};
        resetErrorValues();
      }
    });

    const setCurrentScreen = (screenName) => {
      resetErrorValues();
      currentScreen.value = screenName;
    };

    const handleForm = (fn) => async () => {
      resetErrorValues();
      form.value.acceptsMarketingEmails = acceptsMarketingEmails.value;

      await fn({ user: form.value });

      const hasUserErrors = userError.value.register || userError.value.login;

      if (hasUserErrors) {
        error.login = userError.value.login?.message;
        error.register = userError.value.register?.message;

        send({ message: hasUserErrors.message, type: 'danger', id: Symbol() });

        return;
      }

      toggleLoginModal();

      if (
        isAuthenticated.value &&
        !router?.currentRoute?.name?.toLowerCase()?.includes('checkout')
      ) {
        const localeAccountPath = localePath({ name: 'my-account' });
        return router.push(localeAccountPath);
      }
    };

    const closeModal = () => {
      resetErrorValues();
      setCurrentScreen(SCREEN_LOGIN);
      toggleLoginModal();
    };

    const handleRegister = async () => handleForm(register)();

    const handleLogin = async () => handleForm(login)();

    const handleForgotten = async () => {
      userEmail.value = form.value.username;

      await request({ email: userEmail.value });

      if (!forgotPasswordError.value.request) {
        /* TODO: remove displaying the link here as it will be sent via email */
        passwordResetLink.value = result.value.data;
        setCurrentScreen(SCREEN_THANK_YOU);
      }
    };

    return {
      form,
      error,
      loading,
      isLogin,
      createAccount,
      rememberMe,
      isLoginModalOpen,
      toggleLoginModal,
      handleLogin,
      handleRegister,
      isForgotten,
      forgotPasswordError,
      forgotPasswordLoading,
      handleForgotten,
      closeModal,
      isThankYouAfterForgotten,
      userEmail,
      barTitle,
      currentScreen,
      setCurrentScreen,
      SCREEN_LOGIN,
      SCREEN_REGISTER,
      SCREEN_THANK_YOU,
      SCREEN_FORGOTTEN,
      acceptsMarketingEmails,
      passwordResetLink
    };
  }
});
</script>

<style lang="scss" scoped>
.modal {
  --modal-index: 3;
  --overlay-z-index: 3;
}
.form {
  margin-top: var(--spacer-sm);
  &__element {
    margin: 0 0 var(--spacer-xl) 0;
  }
}
.action {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: var(--spacer-xl) 0 var(--spacer-xl) 0;
  font: var(--font-weight--light) var(--font-size--base) / 1.6
    var(--font-family--secondary);
  & > * {
    margin: 0 0 0 var(--spacer-xs);
  }
}
.action {
  margin: var(--spacer-xl) 0 var(--spacer-xl) 0;
}
.checkbox {
  margin-bottom: var(--spacer-2xl);
}
.bottom {
  text-align: center;
  margin-bottom: var(--spacer-lg);
  font-size: var(--h3-font-size);
  font-weight: var(--font-weight--semibold);
  font-family: var(--font-family--secondary);
  &__paragraph {
    color: var(--c-primary);
    margin: 0 0 var(--spacer-base) 0;
    @include for-desktop {
      margin: 0;
    }
  }
}
.thank-you {
  &__paragraph {
    &--bold {
      font-weight: var(--font-weight--semibold);
    }
  }
}
</style>

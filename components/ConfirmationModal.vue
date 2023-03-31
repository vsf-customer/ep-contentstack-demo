<template>
  <SfModal :visible="isOpen" class="modal" @close="close" role="dialog">
    <template #modal-bar>
      <SfBar
        class="sf-modal__bar smartphone-only"
        :close="true"
        :title="$t('Please confirm')"
        @click:close="close"
      />
    </template>
    <transition name="sf-fade" mode="out-in">
      <div>
        <slot>
          <h3 class="modal__heading">{{ $t(confirmationText) }}</h3>
        </slot>
        <div class="action">
          <SfButton @click="confirm">
            {{ $t(confirmLabel) }}
          </SfButton>
          <SfButton class="color-light" @click="close">
            {{ $t(cancelLabel) }}
          </SfButton>
        </div>
      </div>
    </transition>
  </SfModal>
</template>

<script>
import { ref, watch, reactive } from '@nuxtjs/composition-api';
import {
  SfModal,
  SfButton,
  SfLoader,
  SfAlert,
  SfBar
} from '@storefront-ui/vue';
import { useUiState, useUser } from '@/composables';

export default {
  name: 'ConfirmationModal',
  props: {
    onConfirm: {
      type: Function,
      required: true
    },
    isOpen: {
      type: Boolean,
      required: true
    },
    confirmationText: {
      type: String,
      default: 'Are you sure?'
    },
    confirmLabel: {
      type: String,
      default: 'Yes'
    },
    cancelLabel: {
      type: String,
      default: 'Cancel'
    }
  },
  components: {
    SfModal,
    SfButton,
    SfLoader,
    SfAlert,
    SfBar
  },
  setup() {
    const { isLoginModalOpen, toggleLoginModal } = useUiState();
    const form = ref({});
    const isLogin = ref(false);
    const createAccount = ref(false);
    const rememberMe = ref(false);
    const { register, login, loading, error: userError } = useUser();

    const error = reactive({
      login: null,
      register: null
    });

    const resetErrorValues = () => {
      error.login = null;
      error.register = null;
    };

    watch(isLoginModalOpen, () => {
      if (isLoginModalOpen) {
        form.value = {};
        resetErrorValues();
      }
    });

    const setIsLoginValue = (value) => {
      resetErrorValues();
      isLogin.value = value;
    };

    const handleForm = (fn) => async () => {
      resetErrorValues();
      await fn({ user: form.value });

      const hasUserErrors = userError.value.register || userError.value.login;
      if (hasUserErrors) {
        error.login =
          userError.value.login?.response?.data?.errors?.[0]?.detail ??
          userError.value.login?.message;
        error.register =
          userError.value.register?.response?.data?.errors?.[0]?.detail ??
          userError.value.register?.message;
        return;
      }

      toggleLoginModal();
    };

    const handleRegister = async () => handleForm(register)();

    const handleLogin = async () => handleForm(login)();

    return {
      form,
      error,
      userError,
      loading,
      isLogin,
      createAccount,
      rememberMe,
      isLoginModalOpen,
      toggleLoginModal,
      handleLogin,
      handleRegister,
      setIsLoginValue
    };
  },
  methods: {
    close() {
      this.$emit('on-close');
    },
    confirm() {
      this.onConfirm();
      this.close();
    }
  }
};
</script>

<style lang="scss" scoped>
.modal {
  --modal-index: 3;
  --overlay-z-index: 3;
  text-align: center;
  &__heading {
    font-size: var(--font-size--lg);
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
</style>

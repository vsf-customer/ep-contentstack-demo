<template>
  <SfTabs :open-tab="1" class="tab-orphan">
    <SfTab title="My newsletter">
      <p class="message">
        {{ $t('Set up newsletter') }}
      </p>
      <form @submit.prevent="triggerModal" class="form">
        <SfModal
          :visible="requirePassword"
          :title="$t('Attention!')"
          cross
          persistent
          @close="requirePassword = false"
        >
          {{
            $t(
              'Please type your current password to change your personal details.'
            )
          }}
          <SfInput
            v-model="currentPassword"
            type="password"
            name="currentPassword"
            :label="$t('Current Password')"
            required
            class="form__element"
            style="margin-top: 10px"
            @keypress.enter="handleForm"
          />
          <div v-if="error.authentication">
            {{ error.authentication }}
          </div>
          <SfButton
            class="form__button form__button-inline form__button-width-auto"
            :disabled="loading"
            @click="handleForm"
          >
            <SfLoader :class="{ loader: loading }" :loading="loading">
              <div>
                {{ $t('Update personal data') }}
              </div>
            </SfLoader>
          </SfButton>
        </SfModal>

        <div class="form__checkbox-group">
          <SfCheckbox
            v-model="form.acceptsMarketingEmails"
            name="accept-marketing-emails"
            :label="$t('I want to receive marketing emails')"
            class="form__element"
          />
        </div>
        <SfButton class="form__button" type="submit">
          <SfLoader :class="{ loader: loading }" :loading="loading">
            <div>{{ $t('Save changes') }}</div>
          </SfLoader>
        </SfButton>
      </form>
      <p class="notice">
        {{ $t('Read and understand') }}
        <SfLink class="notice__link" link="#">{{ $t('Privacy') }}</SfLink> and
        <SfLink class="notice__link" link="#">{{
          $t('Cookies Policy')
        }}</SfLink>
        {{ $t('Commercial information') }}
      </p>
    </SfTab>
  </SfTabs>
</template>

<script>
import {
  ref,
  defineComponent,
  reactive,
  useContext,
  watch
} from '@nuxtjs/composition-api';
import {
  SfTabs,
  SfCheckbox,
  SfButton,
  SfLink,
  SfLoader,
  SfInput,
  SfModal
} from '@storefront-ui/vue';
import { useUser } from '@/composables';
import { useUserData } from '../../composables/useUserData';

export default defineComponent({
  name: 'MyNewsletter',
  components: {
    SfTabs,
    SfCheckbox,
    SfButton,
    SfLink,
    SfLoader,
    SfInput,
    SfModal
  },
  setup() {
    const { i18n } = useContext();
    const userData = useUserData();
    const { updateUser, loading, error: updateUserError, user } = useUser();
    const resetForm = () => ({
      acceptsMarketingEmails: userData.getMarketingEmailsConsent(user.value)
    });
    const form = ref(resetForm());

    const requirePassword = ref(false);
    const currentPassword = ref('');
    const error = reactive({
      authentication: null
    });
    const triggerModal = () => {
      requirePassword.value = true;
    };

    const handleForm = async () => {
      error.authentication = '';
      try {
        await updateUser({
          user: {
            password: currentPassword.value,
            acceptsMarketingEmails: form.value.acceptsMarketingEmails
          }
        });
        if (updateUserError.value.updateUser) {
          error.authentication = i18n.t('Invalid credentials');
        } else {
          requirePassword.value = false;
          currentPassword.value = '';
        }
      } catch (error) {
        throw new Error(error);
      }
    };

    watch(user, async () => {
      if (user.value?.id) {
        form.value = resetForm();
      }
    });

    return {
      form,
      handleForm,
      loading,
      triggerModal,
      requirePassword,
      currentPassword,
      error
    };
  }
});
</script>

<style lang="scss" scoped>
.tab-orphan {
  @include for-mobile {
    --tabs-title-display: none;
    --tabs-content-padding: 0;
    --tabs-conent-border-width: 0;
  }
}
.form {
  &__element {
    margin: 0 0 var(--spacer-base) 0;
    &:last-child {
      margin: 0;
    }
  }
  &__checkbox-group {
    margin: 0 0 var(--spacer-xl) 0;
  }
  &__title {
    margin: 0 0 var(--spacer-base) 0;
  }
  &__button {
    --button-width: 100%;
    @include for-desktop {
      --button-width: 17.5rem;
    }
  }
}
.message {
  margin: 0 0 var(--spacer-xl) 0;
  color: var(--c-dark-variant);
}
.notice {
  margin: var(--spacer-base) 0 0 0;
  font-size: var(--font-size--xs);
  &__link {
    color: var(--c-primary);
    text-decoration: none;
    &:hover {
      color: var(--c-text);
    }
  }
}
</style>

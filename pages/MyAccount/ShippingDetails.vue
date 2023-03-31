<template>
  <transition name="fade">
    <div>
      <ConfirmationModal
        :onConfirm="deleteSelectedAddress"
        :isOpen="isConfirmationOpen"
        @on-close="closeConfirmation()"
      />

      <SfTabs
        v-if="editingAddress"
        key="edit-address"
        :open-tab="1"
        class="tab-orphan"
      >
        <SfTab
          :title="$t(isNewAddress ? 'Add the address' : 'Update the address')"
        >
          <p class="message">
            {{ $t('Contact details updated') }}
          </p>

          <ShippingAddressForm
            :address="activeAddress"
            :isNew="isNewAddress"
            @submit="saveAddress"
          />
        </SfTab>
      </SfTabs>

      <SfTabs v-else :open-tab="1" key="address-list" class="tab-orphan">
        <SfTab :title="$t('Shipping details')">
          <p class="message">
            {{ $t('Manage shipping addresses') }}
          </p>
          <SfLoader class="loader" :loading="fetchState.pending">
            <transition-group tag="div" name="fade" class="shipping-list">
              <div
                v-for="address in addresses"
                :key="getId(address)"
                class="shipping"
              >
                <div class="shipping__content">
                  <div class="shipping__address">
                    <UserShippingAddress :address="address" />
                  </div>
                </div>
                <div class="shipping__actions">
                  <SfIcon
                    icon="cross"
                    color="gray"
                    size="14px"
                    role="button"
                    class="smartphone-only"
                    @click="removeAddress(address)"
                  />
                  <SfButton @click="changeAddress(address)">
                    {{ $t('Change') }}
                  </SfButton>

                  <SfButton
                    class="color-light shipping__button-delete desktop-only"
                    @click="removeAddress(address)"
                  >
                    {{ $t('Delete') }}
                  </SfButton>
                </div>
              </div>
            </transition-group>
          </SfLoader>
          <SfButton class="action-button" @click="changeAddress()">
            {{ $t('Add new address') }}
          </SfButton>
        </SfTab>
      </SfTabs>
    </div>
  </transition>
</template>

<script>
import {
  ref,
  watch,
  useFetch,
  computed,
  defineComponent
} from '@nuxtjs/composition-api';
import ConfirmationModal from '@/components/ConfirmationModal';
import UserShippingAddress from '@/components/UserShippingAddress';
import { SfTabs, SfButton, SfIcon, SfLoader } from '@storefront-ui/vue';
import ShippingAddressForm from '@/components/MyAccount/ShippingAddressForm';
import { useUser, useUserShipping, useUserAddressData } from '@/composables';

export default defineComponent({
  name: 'ShippingDetails',
  components: {
    SfTabs,
    SfButton,
    SfIcon,
    SfLoader,
    UserShippingAddress,
    ShippingAddressForm,
    ConfirmationModal
  },
  setup() {
    const {
      shipping,
      load: loadUserShipping,
      addAddress,
      deleteAddress,
      updateAddress
    } = useUserShipping();
    const { user } = useUser();
    const { getId, getAddresses } = useUserAddressData();
    const addresses = computed(() => getAddresses(shipping.value));
    const isConfirmationOpen = ref(false);
    const editingAddress = ref(false);
    const activeAddress = ref(undefined);
    const selectedAddressToDelete = ref(undefined);
    const isNewAddress = computed(() => !activeAddress.value);

    const { fetch, fetchState } = useFetch(async () => {
      await loadUserShipping();
    });

    const deleteSelectedAddress = async () => {
      await deleteAddress({ address: selectedAddressToDelete.value });
      fetch();

      isConfirmationOpen.value = false;
      selectedAddressToDelete.value = null;
    };

    const changeAddress = (address = undefined) => {
      activeAddress.value = address;
      editingAddress.value = true;
    };

    const closeConfirmation = () => {
      isConfirmationOpen.value = false;
    };

    const removeAddress = (address) => {
      selectedAddressToDelete.value = address;
      isConfirmationOpen.value = true;
    };

    const saveAddress = async ({ form, onComplete, onError }) => {
      try {
        const actionMethod = isNewAddress.value ? addAddress : updateAddress;
        await actionMethod({ address: { ...form, isShipping: true } });
        editingAddress.value = false;
        activeAddress.value = undefined;
        await onComplete();
        fetch();
      } catch (e) {
        onError(e);
        return false;
      }
    };

    watch(user, () => {
      if (user.value?.id) {
        fetch();
      }
    });

    return {
      changeAddress,
      updateAddress,
      removeAddress,
      saveAddress,
      getId,
      addresses,
      editingAddress,
      isConfirmationOpen,
      activeAddress,
      isNewAddress,
      closeConfirmation,
      deleteSelectedAddress,
      fetchState,
      user
    };
  }
});
</script>

<style lang="scss" scoped>
.message {
  font-family: var(--font-family--primary);
  line-height: 1.6;
  font-size: var(--font-size--base);
  margin: 0 0 var(--spacer-base);
}
.shipping-list {
  margin-bottom: var(--spacer-base);
}
.shipping {
  display: flex;
  padding: var(--spacer-xl) 0;
  border-top: 1px solid var(--c-light);

  &:last-child {
    border-bottom: 1px solid var(--c-light);
  }
  &__content {
    flex: 1;
    color: var(--c-text);
    font-size: var(--font-size--base);
    font-weight: 300;
    line-height: 1.6;
  }
  &__actions {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    @include for-desktop {
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
    }
  }
  &__button-delete {
    color: var(--c-link);
    @include for-desktop {
      margin-left: var(--spacer-base);
    }
  }
  &__address {
    margin: 0;
    p {
      margin: 0;
    }
  }
  &__client-name {
    font-size: var(--font-size--base);
    font-weight: 500;
  }
}
.action-button {
  width: 100%;
  @include for-desktop {
    width: auto;
  }
}
.tab-orphan {
  @include for-mobile {
    ::v-deep .sf-tabs {
      &__title {
        display: none;
      }

      &__content {
        border: 0;
        padding: 0;
      }
    }
  }
}
.loader {
  min-height: 100px;
}
</style>

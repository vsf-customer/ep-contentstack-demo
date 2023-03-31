<template>
  <div>
    <div>
      <strong
        >{{ userAddressData.getLine1(address) }}
        {{ userAddressData.getLine2(address) }},
        {{ userAddressData.getCity(address) }}
        {{ userAddressData.getPostCode(address) }},
        {{ userAddressData.getCountry(address) }}
      </strong>
    </div>
    <div>
      {{ address && address.name }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import { useUserAddressData } from '@/composables/useUserAddressData';
import { Address } from '@vsf-enterprise/epcc-api';

export default defineComponent({
  name: 'UserBillingAddress',
  props: {
    address: {
      type: Object as () => Address,
      required: true
    }
  },
  setup() {
    const userAddressData = useUserAddressData();
    return {
      userAddressData
    };
  }
});
</script>

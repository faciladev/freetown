<template>
  <q-page padding>
    <div class="absolute-center">
      <qrcode-vue :value="value" :size="size" level="H" />
    </div>
  </q-page>
</template>
<script>
import QrcodeVue from "qrcode.vue";

export default {
  setup() {
    return {
      value: "https://example.com",
      size: 300,
    };
  },

  components: {
    QrcodeVue,
  },
};
</script>

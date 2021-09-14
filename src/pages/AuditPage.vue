<template>
  <q-page padding>
    <q-banner
      inline-actions
      class="q-mb-sm list-header text-white text-center bg-secondary"
    >
      <span class="text-bold text-subtitle1">Audit Transactions</span>
    </q-banner>
    <q-uploader
      url="http://localhost:4444/upload"
      label="Upload Sales File"
      square
      flat
      bordered
      style="width: 100%"
    />
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  setup() {
    const store = useStore();
    // onMounted(async () => {
    //   //Get all users
    //   await store.dispatch("auth/getAllUsers");
    //   console.log(store.state.auth.users);
    // });

    return {};
  },
});
</script>

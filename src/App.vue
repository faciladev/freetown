<template>
  <router-view />
</template>
<script>
import { defineComponent, onMounted } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "App",
  setup() {
    const store = useStore();
    onMounted(async () => {
      store.dispatch("auth/handleAuthStateChange");
      await store.dispatch("auth/loadSettings");
    });

    return {};
  },
});
</script>

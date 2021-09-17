<template>
  <router-view />
</template>
<script>
import { defineComponent, onMounted, computed, watch } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "App",
  setup() {
    const store = useStore();
    const loggedInUser = computed(() => store.state.auth.loggedInUser);
    // const loadSettings = (loggedInUser) => {
    // if (loggedInUser) store.dispatch("auth/loadSettings");
    watch(loggedInUser, (value) => {
      console.log("***watched***", value);
      if (value) {
        store.dispatch("auth/loadSettings", loggedInUser);
      }
    });
    // };
    onMounted(async () => {
      store.dispatch("auth/handleAuthStateChange");
      // loadSettings(loggedInUser);
    });

    return {
      // loggedInUser: computed(() => store.state.auth.loggedInUser),
    };
  },
});
</script>

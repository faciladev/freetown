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
    //Watch state
    watch(loggedInUser, (value) => {
      //only load setting when user is logged in
      if (value) {
        store.dispatch("auth/loadSettings", loggedInUser);
      }
    });
    // };
    onMounted(async () => {
      store.dispatch("auth/handleAuthStateChange");
    });

    return {};
  },
});
</script>

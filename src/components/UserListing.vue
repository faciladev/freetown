<template>
  <div>
    <q-banner
      inline-actions
      class="list-header text-white text-center bg-secondary"
    >
      <span class="text-bold text-subtitle1">Users</span>
    </q-banner>
    <transition
      appear
      enter-active-class="animated zoomIn"
      leave-active-class="animated zoomOut"
    >
      <q-infinite-scroll @load="onLoad" :offset="500" v-if="loggedInUser">
        <q-list bordered separator v-if="users">
          <User :user="user" v-for="user in users" :key="user" />
        </q-list>
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner-dots color="primary" size="40px" />
          </div>
        </template>
      </q-infinite-scroll>
    </transition>
  </div>
</template>

<script>
import User from "src/components/User.vue";
import { computed, onUnmounted } from "vue";
import { useStore } from "vuex";
export default {
  components: { User },
  setup() {
    const store = useStore();
    onUnmounted(() => {
      store.commit("auth/setLastDocVal", null);
      store.commit("auth/clearUsers");
    });
    return {
      loggedInUser: computed(() => store.state.auth.loggedInUser),
      users: computed(() => store.state.auth.users),
      onLoad(index, done) {
        store.dispatch("auth/getAllUsers", done);
      },
    };
  },
};
</script>

<style></style>

<template>
  <div>
    <q-banner
      inline-actions
      class="list-header text-white text-center bg-secondary"
    >
      <span class="text-bold text-subtitle1">Users</span>
    </q-banner>
    <q-list bordered separator v-if="users">
      <User :user="user" v-for="user in users" :key="user" />
    </q-list>
    <span class="absolute-center" v-else>
      <q-spinner color="primary" size="3em" />
    </span>
  </div>
</template>

<script>
import User from "src/components/User.vue";
export default {
  props: { users: Array },
  components: { User },
  setup() {
    return {};
  },
};
</script>

<style></style>

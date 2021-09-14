<template>
  <q-page padding>
    <q-infinite-scroll @load="onLoad" :offset="500">
      <div class="row q-mb-lg">
        <Search searchItem="user" />
      </div>
      <transition
        appear
        enter-active-class="animated zoomIn"
        leave-active-class="animated zoomOut"
      >
        <UserListing :users="users" v-if="users" />
      </transition>

      <div class="absolute-bottom text-center q-mb-lg no-pointer-events">
        <q-btn
          @click="showModal = true"
          round
          style="align-item: center"
          class="all-pointer-events"
          color="primary"
          size="24px"
          icon="add"
        />
      </div>
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>
    <UserModal :showModal="showModal" :hideModal="hideModal" />
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import Search from "src/components/Search.vue";
import UserListing from "src/components/UserListing.vue";
import UserModal from "src/components/modals/UserModal.vue";
import EditUserModal from "src/components/modals/EditUserModal.vue";

export default defineComponent({
  components: {
    Search,
    UserListing,
    UserModal,
    EditUserModal,
  },
  setup() {
    const showModal = ref(false);
    const store = useStore();
    // onMounted(async () => {
    //   //Get all users
    //   await store.dispatch("auth/getAllUsers");
    //   console.log(store.state.auth.users);
    // });

    return {
      onLoad(index, done) {
        store.dispatch("auth/getAllUsers", done);
      },
      // editModal,
      showModal,
      hideModal: () => {
        showModal.value = false;
      },
      users: computed(() => store.state.auth.users),
    };
  },
});
</script>

<style scoped>
.q-scroll-area {
  display: flex;
  flex-grow: 1;
}
</style>

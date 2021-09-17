<template>
  <q-page padding>
    <div class="row q-mb-lg">
      <Search :updateSearch="updateSearch" />
    </div>

    <SearchResult searchItem="user" v-if="search" />
    <UserListing v-else />

    <div class="fixed-bottom text-center q-mb-lg no-pointer-events">
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

    <UserModal :showModal="showModal" :hideModal="hideModal" />
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { debounce } from "quasar";
import Search from "src/components/Search.vue";
import UserListing from "src/components/UserListing.vue";
import UserModal from "src/components/modals/UserModal.vue";
import EditUserModal from "src/components/modals/EditUserModal.vue";
import SearchResult from "src/components/SearchResult.vue";

export default defineComponent({
  components: {
    Search,
    UserListing,
    UserModal,
    SearchResult,
    EditUserModal,
  },
  setup() {
    const showModal = ref(false);
    const store = useStore();

    return {
      search: computed(() => store.state.auth.search),
      updateSearch: debounce((value) => {
        //Query database populate search result
        store.dispatch("auth/search", {
          searchTerm: value,
          searchItem: "user",
        });
      }),
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

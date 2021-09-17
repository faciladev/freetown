<template>
  <q-page padding>
    <div class="row q-mb-lg">
      <Search :updateSearch="updateSearch" />
    </div>

    <SearchResult searchItem="transaction" v-if="search" />
    <TransactionListing v-else />

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

    <TransactionModal :showModal="showModal" :hideModal="hideModal" />
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { debounce } from "quasar";
import { useRouter } from "vue-router";
import Search from "src/components/Search.vue";
import TransactionListing from "src/components/TransactionListing.vue";
import TransactionModal from "src/components/modals/TransactionModal.vue";
import EditTransactionModal from "src/components/modals/EditTransactionModal.vue";
import SearchResult from "src/components/SearchResult.vue";

export default defineComponent({
  components: {
    Search,
    TransactionListing,
    TransactionModal,
    EditTransactionModal,
    SearchResult,
  },
  setup() {
    const showModal = ref(false);
    const store = useStore();
    // onMounted(async () => {

    // });

    return {
      search: computed(() => store.state.auth.search),
      updateSearch: debounce((value) => {
        //Query database populate search result
        store.dispatch("auth/search", {
          searchTerm: value,
          searchItem: "transaction",
        });
      }),
      // editModal,
      showModal,
      hideModal: () => {
        showModal.value = false;
      },
      // transactions: computed(() => store.state.auth.transactions),
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

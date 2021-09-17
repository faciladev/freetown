<template>
  <q-page padding>
    <q-infinite-scroll @load="onLoad" :offset="500">
      <div class="row q-mb-lg">
        <Search searchItem="transaction" />
      </div>
      <transition
        appear
        enter-active-class="animated zoomIn"
        leave-active-class="animated zoomOut"
      >
        <TransactionListing :transactions="transactions" v-if="transactions" />
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
    <TransactionModal :showModal="showModal" :hideModal="hideModal" />
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import Search from "src/components/Search.vue";
import TransactionListing from "src/components/TransactionListing.vue";
import TransactionModal from "src/components/modals/TransactionModal.vue";
import EditTransactionModal from "src/components/modals/EditTransactionModal.vue";

export default defineComponent({
  components: {
    Search,
    TransactionListing,
    TransactionModal,
    EditTransactionModal,
  },
  setup() {
    const showModal = ref(false);
    const store = useStore();

    return {
      async onLoad(index, done) {
        await store.dispatch("auth/getAllTransactions", done);
      },
      // editModal,
      showModal,
      hideModal: () => {
        showModal.value = false;
      },
      transactions: computed(() => store.state.auth.transactions),
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

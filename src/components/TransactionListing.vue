<template>
  <div>
    <q-banner
      inline-actions
      class="list-header text-white text-center bg-secondary"
    >
      <span class="text-bold text-subtitle1">Transactions</span>
    </q-banner>
    <transition
      appear
      enter-active-class="animated zoomIn"
      leave-active-class="animated zoomOut"
    >
      <q-infinite-scroll @load="onLoad" v-if="loggedInUser" :offset="500">
        <q-list bordered separator v-if="transactions">
          <Transaction
            :transaction="transaction"
            v-for="transaction in transactions"
            :key="transaction"
          />
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
import Transaction from "src/components/Transaction.vue";
import { useStore } from "vuex";
import { computed, onUnmounted } from "vue";
export default {
  components: { Transaction },
  setup() {
    const store = useStore();
    onUnmounted(() => {
      store.commit("auth/setLastDocValTrans", 0);
      store.commit("auth/clearTransactions");
    });
    return {
      loggedInUser: computed(() => store.state.auth.loggedInUser),
      transactions: computed(() => store.state.auth.transactions),
      async onLoad(index, done) {
        await store.dispatch("auth/getAllTransactions", done);
      },
    };
  },
};
</script>

<style></style>

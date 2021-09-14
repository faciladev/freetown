<template>
  <div>
    <q-banner
      inline-actions
      class="list-header text-white text-center bg-secondary"
    >
      <span class="text-bold text-subtitle1">Transactions</span>
    </q-banner>
    <q-list bordered separator v-if="transactions">
      <Transaction
        :transaction="transaction"
        v-for="transaction in transactions"
        :key="transaction"
      />
    </q-list>
    <span class="absolute-center" v-else>
      <q-spinner color="primary" size="3em" />
    </span>
  </div>
</template>

<script>
import Transaction from "src/components/Transaction.vue";
export default {
  props: { transactions: Array },
  components: { Transaction },
  setup() {
    return {};
  },
};
</script>

<style></style>

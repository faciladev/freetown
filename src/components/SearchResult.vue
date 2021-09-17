<template>
  <div>
    <q-banner
      inline-actions
      class="list-header text-white text-center bg-secondary"
    >
      <span class="text-bold text-subtitle1">Search Result</span>
    </q-banner>
    <template v-if="searchItem == 'transaction'">
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
    </template>
    <template v-if="searchItem == 'user'">
      <q-list bordered separator v-if="users">
        <User :user="user" v-for="user in users" :key="user" />
      </q-list>
      <span class="absolute-center" v-else>
        <q-spinner color="primary" size="3em" />
      </span>
    </template>
  </div>
</template>

<script>
import Transaction from "src/components/Transaction.vue";
import User from "src/components/User.vue";
import { useStore } from "vuex";
import { computed } from "vue";
export default {
  props: { searchItem: String },
  components: { Transaction, User },
  setup() {
    const store = useStore();
    return {
      transactions: computed(() => store.state.auth.foundTransactions),
      users: computed(() => store.state.auth.foundUsers),
    };
  },
};
</script>

<style></style>

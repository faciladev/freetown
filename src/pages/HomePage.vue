<template>
  <q-page padding>
    <!-- <div class="q-ma-lg"> -->
    <div class="row menu">
      <q-btn class="q-ma-sm" padding="10%" color="secondary" icon="home" />
      <q-btn
        v-if="hasPermission('Transactions', loggedInUser)"
        to="/transactions"
        class="q-ma-sm"
        padding="10%"
        color="secondary"
        icon="attach_money"
      />
      <q-btn
        v-if="hasPermission('Redeem', loggedInUser)"
        to="/redeem"
        class="q-ma-sm"
        padding="10%"
        color="secondary"
        icon="crop_free"
      />
      <q-btn
        v-if="hasPermission('Audit', loggedInUser)"
        to="/audit"
        class="q-ma-sm"
        padding="10%"
        color="secondary"
        icon="check"
      />
      <q-btn
        v-if="hasPermission('Reports', loggedInUser)"
        to="/reports"
        class="q-ma-sm"
        padding="10%"
        color="secondary"
        icon="calendar_view_month"
      />
      <q-btn
        v-if="hasPermission('Settings', loggedInUser)"
        to="/settings"
        class="q-ma-sm"
        padding="10%"
        color="secondary"
        icon="settings"
      />
      <q-btn
        v-if="hasPermission('Users', loggedInUser)"
        to="/users"
        class="q-ma-sm"
        padding="10%"
        color="secondary"
        icon="people"
      />
    </div>
    <!-- </div> -->
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  setup() {
    const store = useStore();
    const loggedInUser = computed(() => store.state.auth.loggedInUser);

    const securityRule = {
      Sales: ["Home", "Transactions", "Redeem"],
      Auditor: ["Home", "Transactions", "Redeem", "Audit"],
      Admin: [
        "Home",
        "Transactions",
        "Redeem",
        "Audit",
        "Reports",
        "Settings",
        "Reports",
        "Users",
      ],
    };
    const hasPermission = (link, loggedInUser) => {
      return loggedInUser && loggedInUser.userType
        ? securityRule[loggedInUser.userType].indexOf(link) != -1
        : false;
    };
    return {
      loggedInUser,
      hasPermission,
    };
  },
});
</script>

<style scoped>
.menu {
  margin: 0 auto !important;
  justify-content: center;
}
</style>

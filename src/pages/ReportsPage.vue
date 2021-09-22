<template>
  <q-page padding>
    <div class="row q-mb-lg filter">
      <!-- <div class="column">-->
      <div class="column">
        <q-select
          class="q-ml-lg"
          style="width: 150px"
          :model-value="log"
          @update:model-value="logTypeChanged"
          :options="logOptions"
          label="Log Type"
        />
      </div>
      <div class="column">
        <q-select
          class="q-ml-lg"
          style="width: 150px"
          :model-value="user"
          @update:model-value="userChanged"
          :options="userOptions"
          label="Select User"
        />
      </div>
      <div class="q-ml-lg column date-picker">
        <q-btn icon="event" round color="primary">
          <q-popup-proxy transition-show="scale" transition-hide="scale">
            <q-date v-model="proxyDate" range>
              <div class="row items-center justify-end q-gutter-sm">
                <q-btn label="Cancel" color="primary" flat v-close-popup />
                <q-btn
                  label="OK"
                  color="primary"
                  flat
                  @click="save"
                  v-close-popup
                />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-btn>
      </div>
    </div>
    <div class="q-pa-md">
      <q-banner
        inline-actions
        class="q-mb-sm list-header text-white text-center bg-secondary"
      >
        <span class="text-bold text-subtitle1"
          >Transaction History {{ getLogTime() }}</span
        >
      </q-banner>
      <q-table v-if="rows" :columns="columns" :rows="rows" row-key="id" />
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, computed, watch } from "vue";
import { firebase } from "boot/firebase";
import { useStore } from "vuex";
import { date as dateUtil } from "quasar";

export default defineComponent({
  setup() {
    const columns = [
      { name: "logTime", align: "left", label: "Log Time", field: "logTime" },
      {
        name: "referenceNo",
        align: "center",
        label: "Reference No.",
        field: "referenceNo",
      },
      {
        name: "time",
        align: "center",
        label: "Bill Time",
        field: "time",
      },
      {
        name: "amount",
        align: "center",
        label: "Bill Amount",
        field: "amount",
      },
      {
        name: "rewardAmt",
        align: "center",
        label: "Reward Amount",
        field: "rewardAmt",
      },
      { name: "status", align: "center", label: "Status", field: "status" },
      { name: "phoneNo", align: "right", label: "Phone No.", field: "phoneNo" },
    ];
    const logOptions = ["All", "Commissioned", "Rewarded", "Redeemed"];

    const store = useStore();
    const date = ref(new Date().toLocaleString().split(",")[0]);
    const proxyDate = ref(null);
    const user = ref("All");
    const log = ref("All");
    const rows = computed(() => {
      if (store.state.auth.transactionLogs) {
        return store.state.auth.transactionLogs.map((log) => {
          return {
            ...log,
            logTime: dateUtil.formatDate(
              log.logTime.toDate(),
              "MM/DD/YYYY H:m"
            ),
          };
        });
      }
    });
    const userOptions = ref(["All"]);
    const users = computed(() => {
      if (store.state.auth.users && userOptions.value.length == 1) {
        userOptions.value.push(
          ...store.state.auth.users.map((user) => user.fullName)
        );
        return store.state.auth.users.map((user) => user.fullName);
      }
    });
    watch(users, (value) => {
      //Watch users only to execute computed property's inside
    });

    const getTransactionLogs = () => {
      store.dispatch("auth/getTransactionLogs", {
        log: log.value == "All" ? null : log.value.toLowerCase(),
        user: user.value == "All" ? null : user.value,
        date: date.value,
      });
    };
    onMounted(() => {
      store.dispatch("auth/getAllUsers");
      getTransactionLogs();
    });

    return {
      getTransactionLogs,
      rows,
      columns,
      logOptions,
      log,
      user,
      userOptions,
      date,
      proxyDate,
      userChanged(value) {
        user.value = value;
        getTransactionLogs();
      },
      logTypeChanged(value) {
        log.value = value;
        getTransactionLogs();
      },
      getLogTime() {
        if (date.value) {
          if (typeof date.value == "string") {
            return date.value;
          } else if (date.value.from && date.value.to) {
            return `${date.value.from} - ${date.value.to}`;
          }
        }
      },
      updateProxy() {
        proxyDate.value = date.value;
      },

      save() {
        date.value = proxyDate.value;
        getTransactionLogs();
      },
    };
  },
});
</script>

<style scoped>
.filter,
.date-picker {
  justify-content: center;
}
</style>

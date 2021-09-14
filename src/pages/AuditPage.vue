<template>
  <q-page padding>
    <q-banner
      inline-actions
      class="q-mb-sm list-header text-white text-center bg-secondary"
    >
      <span class="text-bold text-subtitle1">Audit Transactions</span>
    </q-banner>
    <q-uploader
      url="http://localhost:4444/upload"
      label="Upload Sales File"
      square
      flat
      bordered
      auto-upload
      :form-fields="additionalFields"
      style="width: 100%"
    />
    <div class="absolute-center">
      <q-btn
        icon="account_balance"
        flat
        :label="businessBank"
        class="q-pa-lg"
        color="secondary"
        size="2em"
      />
    </div>
    <q-dialog v-model="showReward">
      <q-card>
        <q-card-section class="row">
          <div class="text-h6">Reward Transaction</div>
          <q-space />
          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>
        <q-list>
          <q-item>
            <!-- <q-item-section avatar>
              <q-icon color="primary" name="local_bar" />
            </q-item-section> -->
            <q-item-section>
              <q-item-label>(251)-932-508181</q-item-label>
              <q-item-label caption>Phone No.</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <!-- <q-item-section avatar>
              <q-icon color="primary" name="local_bar" />
            </q-item-section> -->
            <q-item-section>
              <q-item-label>CS-10001-21</q-item-label>
              <q-item-label caption>Reference No.</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <!-- <q-item-section avatar>
              <q-icon color="primary" name="local_bar" />
            </q-item-section> -->
            <q-item-section>
              <q-item-label>304.00</q-item-label>
              <q-item-label caption>Bill Amount.</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <!-- <q-item-section avatar>
              <q-icon color="primary" name="local_bar" />
            </q-item-section> -->
            <q-item-section>
              <q-item-label>50%</q-item-label>
              <q-item-label caption>Reward by Percent</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <q-item>
          <!-- <q-item-section avatar>
              <q-icon color="primary" name="local_bar" />
            </q-item-section> -->
          <q-item-section>
            <q-item-label>152.00</q-item-label>
            <q-item-label caption>Reward Amount</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator />

        <q-card-actions class="action-menu q-ma-md">
          <q-btn color="primary">Send </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  setup() {
    const store = useStore();
    onMounted(() => {
      store.dispatch("auth/getBank");
    });

    return {
      showReward: true,
      businessBank: computed(() => `$${store.state.auth.bank}`),
      additionalFields: () => {
        return [
          {
            name: "businessId",
            value: computed(() => store.state.auth.loggedInUser.businessId)
              .value,
          },
        ];
      },
    };
  },
});
</script>

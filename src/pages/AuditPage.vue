<template>
  <q-page padding>
    <q-banner
      inline-actions
      class="q-mb-sm list-header text-white text-center bg-secondary"
    >
      <span class="text-bold text-subtitle1">Audit Transactions</span>
    </q-banner>
    <q-uploader
      url="https://freetownapp.herokuapp.com/upload"
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
        v-if="loggedInUser && loggedInUser.userType == 'Admin'"
        :disable="!hasWinner"
        @click="showReward = true"
        icon="account_balance"
        flat
        :label="businessBank"
        class="q-pa-lg"
        :color="hasWinner ? 'green' : 'primary'"
        size="2em"
      />
    </div>
    <RewardModal
      :showReward="showReward"
      :hasWinner="hasWinner"
      :nextWinner="nextWinner"
      :hideModal="hideRewardModal"
      :reward="reward"
      :submitting="submitting"
    />
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import RewardModal from "src/components/modals/RewardModal.vue";
import { LocalStorage, date as dateUtil, useQuasar } from "quasar";
import {
  Plugins,
  registerWebPlugin,
} from "app/src-capacitor/node_modules/@capacitor/core";
import { showErrorMessage } from "src/functions/function-show-error";
const { Share } = Plugins;
import { SmsManager } from "app/src-capacitor/node_modules/@byteowls/capacitor-sms";

export default defineComponent({
  components: { RewardModal },

  setup() {
    const $q = useQuasar();

    const store = useStore();
    const showReward = ref(false);
    const submitting = ref(false);
    const nextWinner = computed(() => store.state.auth.nextWinner);
    const hasWinner = computed(() => store.state.auth.hasWinner);
    const rewardSMSText = computed(
      () =>
        store.state.auth.settings.sms[store.state.auth.settings.sms.defaultLang]
    );

    onMounted(async () => {
      store.dispatch("auth/getBank");

      store.dispatch("auth/getNextWinner");
      registerWebPlugin(SmsManager);
    });

    return {
      loggedInUser: computed(() => store.state.auth.loggedInUser),
      submitting,
      reward: async () => {
        if ($q.platform.is.mobile) {
          submitting.value = true;
          const numbers = [nextWinner.value.phoneNo];
          const qr = await store.dispatch("auth/getUniqueQR", 6);

          let text = rewardSMSText.value;
          text = text.replace(/\$amount/, nextWinner.value.rewardAmt);
          text = text.replace(/\$ticket/, qr);
          text = text.replace(
            /\$time/,
            dateUtil.formatDate(
              nextWinner.value.time.toDate(),
              "MM/DD/YYYY H:m"
            )
          );

          await store.dispatch("auth/rewardWinner", qr);
          Plugins.SmsManager.send({
            numbers,
            text,
          })
            .then(() => {
              // SMS app was opened
              submitting.value = false;
            })
            .catch((error) => {
              submitting.value = false;
              // see error codes below
              showErrorMessage("Error rewarding winner: ", error.message);
            });
        } else {
          submitting.value = false;
          showErrorMessage("This operation is not supported on this device.");
        }
      },
      hideRewardModal: () => (showReward.value = false),
      hasWinner,
      nextWinner,
      rewardSMSText,
      showReward,

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

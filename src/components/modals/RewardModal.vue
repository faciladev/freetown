<template>
  <q-dialog v-model="showReward" @hide="hideModal" v-if="hasWinner">
    <q-card>
      <q-card-section class="row">
        <div class="text-h6">Reward Transaction</div>
        <q-space />
        <q-btn flat round dense icon="close" @click="hideModal" />
      </q-card-section>
      <q-list>
        <q-item>
          <!-- <q-item-section avatar>
              <q-icon color="primary" name="local_bar" />
            </q-item-section> -->
          <q-item-section>
            <q-item-label caption>Phone No.</q-item-label>
            <q-item-label>{{ nextWinner.phoneNo }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <!-- <q-item-section avatar>
              <q-icon color="primary" name="local_bar" />
            </q-item-section> -->
          <q-item-section>
            <q-item-label caption>Reference No.</q-item-label>
            <q-item-label
              >CS-{{ nextWinner.referenceNo }}-{{ currYear }}</q-item-label
            >
          </q-item-section>
        </q-item>
        <q-item>
          <!-- <q-item-section avatar>
              <q-icon color="primary" name="local_bar" />
            </q-item-section> -->
          <q-item-section>
            <q-item-label caption>Bill Amount.</q-item-label>
            <q-item-label>{{ nextWinner.amount }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <!-- <q-item-section avatar>
              <q-icon color="primary" name="local_bar" />
            </q-item-section> -->
          <q-item-section>
            <q-item-label caption>Reward Amount</q-item-label>
            <q-item-label>{{ nextWinner.rewardAmt }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <q-separator />

      <q-card-actions class="action-menu q-ma-md">
        <q-btn :loading="submitting" @click="reward" color="primary"
          >Send SMS</q-btn
        >
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: {
    nextWinner: Object,
    hasWinner: Boolean,
    showReward: Boolean,
    hideModal: Function,
    reward: Function,
    submitting: Boolean,
  },
  setup() {
    return {
      currYear: new Date().getFullYear().toString().substring(2, 4),
    };
  },
};
</script>

<style scoped>
.action-menu {
  justify-content: center;
}
</style>

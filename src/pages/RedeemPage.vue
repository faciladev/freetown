<template>
  <q-page padding>
    <q-banner
      inline-actions
      class="q-mb-sm list-header text-white text-center bg-secondary"
    >
      <span class="text-bold text-subtitle1">Redeem Transaction</span>
    </q-banner>
    <q-card>
      <q-card-section class="q-pt-none">
        <q-form @submit="submitForm">
          <div class="row q-mb-sm">
            <q-input
              type="text"
              style="width: 100%"
              v-model="qr"
              label="Winner Code"
              :rules="[
                (val) => validateQR(val) || 'Code must be six characters long.',
              ]"
            />
            <p v-if="redeemedAmount" style="color: green">
              Redeemed Amount: {{ redeemedAmount.rewardAmt }} birr
            </p>
          </div>

          <q-card-section>
            <q-card-actions align="center">
              <q-btn
                type="submit"
                :loading="submitting"
                icon="crop_free"
                label="Redeem"
                class="q-mt-md right"
                color="primary"
              />
            </q-card-actions>
          </q-card-section>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  setup() {
    const showModal = ref(false);
    const store = useStore();
    const qr = ref("");
    const submitting = ref(false);
    const redeemedAmount = ref(null);

    return {
      redeemedAmount,
      qr,
      validateQR: (val) => {
        if (val.length < 6 || val.length > 6) {
          return false;
        }
        return true;
      },
      submitForm: async () => {
        submitting.value = true;
        redeemedAmount.value = await store.dispatch(
          "auth/redeemTransaction",
          qr.value
        );
        submitting.value = false;
      },
      submitting,
      formData: {},
    };
  },
});
</script>

<style scoped></style>

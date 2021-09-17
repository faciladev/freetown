<template>
  <q-dialog v-model="editModal" @hide="hideModal">
    <q-card>
      <q-card-section class="q-pt-none">
        <q-card-section class="row">
          <div class="text-h6">Edit Transaction</div>
          <q-space />
          <q-btn flat round dense icon="close" @click="hideModal" />
        </q-card-section>
        <q-form @submit="submitForm">
          <div class="row q-mb-sm">
            <q-input
              disable
              style="width: 100%"
              :rules="[
                (val) => validateMask(val) || 'Enter valid phone number',
              ]"
              v-model="transactionToSubmit.referenceNo"
              label="Reference No."
              fill-mask
              mask="#####"
            />
          </div>
          <div class="row q-mb-sm">
            <q-input
              style="width: 100%"
              :rules="[
                (val) => validatePhoneNo(val) || 'Enter valid phone number',
              ]"
              v-model="transactionToSubmit.phoneNo"
              label="Cell Phone"
              fill-mask
              mask="(###) ### - ######"
            />
          </div>
          <q-card-section>
            <q-card-actions align="center">
              <q-btn
                type="submit"
                :loading="submitting"
                label="Update"
                class="q-mt-md right"
                color="primary"
              />
            </q-card-actions>
          </q-card-section>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { Notify } from "quasar";
import { ref, reactive, computed, onMounted } from "vue";
import { useStore } from "vuex";
export default {
  props: {
    editModal: Boolean,
    hideModal: Function,
    transaction: Object,
  },

  setup(props) {
    const store = useStore();
    let transactionToSubmit = reactive(Object.assign({}, props.transaction));
    const phone = transactionToSubmit.phoneNo;
    transactionToSubmit.phoneNo = `(251) ${phone.substring(
      1,
      4
    )}-${phone.substring(4, 10)}`;
    const submitting = ref(false);
    const validateMask = (val) => {
      //Doesn't have _ and has something else
      return !/\_/.test(val) && /[^_]+/.test(val);
    };
    const validatePhoneNo = (val) => {
      return validateMask(val) && /^\(251\)\s9/.test(val);
    };

    return {
      transactionToSubmit,
      submitting,
      validateMask,
      validatePhoneNo,
      submitForm: async () => {
        submitting.value = true;
        const res = transactionToSubmit.phoneNo.split("-");
        const initial = res[0].substring(6, 9);
        const main = res[1].trim();
        const phoneNo = `0${initial}${main}`;
        await store.dispatch("auth/editTransaction", {
          ...transactionToSubmit,
          phoneNo,
        });
        submitting.value = false;
        props.hideModal();

        Notify.create("Successfully Updated!");
      },
    };
  },
};
</script>

<style></style>

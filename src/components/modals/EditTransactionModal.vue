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
              style="width: 100%"
              v-model="transactionToSubmit.referenceNo"
              label="Reference No."
              fill-mask
              mask="#####"
            />
          </div>
          <div class="row q-mb-sm">
            <q-input
              style="width: 100%"
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
    const submitting = ref(false);

    return {
      transactionToSubmit,
      submitting,

      submitForm: async () => {
        submitting.value = true;
        await store.dispatch("auth/editTransaction", transactionToSubmit);
        submitting.value = false;
        props.hideModal();

        Notify.create("Successfully Updated!");
      },
    };
  },
};
</script>

<style></style>

<template>
  <q-dialog v-model="showModal" @hide="hideModal">
    <q-card>
      <q-card-section class="q-pt-none">
        <q-card-section class="row">
          <div class="text-h6">Register Transaction</div>
          <q-space />
          <q-btn flat round dense icon="close" @click="hideModal" />
        </q-card-section>
        <q-form @submit="submitForm">
          <div class="row q-mb-sm">
            <q-input
              style="width: 100%"
              v-model="formData.referenceNo"
              mask="#####"
              label="Reference No."
              fill-mask
            />
          </div>

          <div class="row q-mb-sm">
            <q-input
              style="width: 100%"
              v-model="formData.phoneNo"
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
                label="Register"
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
import { computed, reactive } from "vue";
import { Notify } from "quasar";
import { useStore } from "vuex";
export default {
  props: { showModal: Boolean, hideModal: Function },

  setup(props) {
    const store = useStore();
    const userTypes = ["Sales Person", "Auditor", "Admin"];
    const formData = reactive({
      phoneNo: "2519",
      status: "registered",
      businessId: null,
      referenceNo: "",
    });

    return {
      formData,
      submitting: computed(() => store.state.auth.submitting),
      userTypes,
      isValidEmail(email) {
        const re =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
      },
      submitForm: async () => {
        await store.dispatch("auth/registerTransaction", formData);
        formData.phoneNo = "2519";
        formData.referenceNo = "";
        formData.businessId = null;
        props.hideModal();
      },
    };
  },
};
</script>

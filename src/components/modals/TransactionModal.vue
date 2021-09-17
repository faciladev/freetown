<template>
  <q-dialog v-model="showModal" @hide="hideModal">
    <q-card>
      <q-card-section class="q-pt-none">
        <q-card-section class="row">
          <div class="text-h6">Register Transaction</div>
          <q-space />
          <q-btn flat round dense icon="close" @click="hideModal" />
        </q-card-section>
        <q-form @submit.prevent="submitForm">
          <div class="row q-mb-sm">
            <q-input
              autofocus
              style="width: 100%"
              v-model="formData.referenceNo"
              :rules="[
                (val) => validateMask(val) || 'Enter valid phone number',
              ]"
              mask="#####"
              label="Reference No."
              fill-mask
            />
          </div>

          <div class="row q-mb-sm">
            <q-input
              style="width: 100%"
              :rules="[
                (val) => validatePhoneNo(val) || 'Enter valid phone number',
              ]"
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
import { computed, reactive, ref } from "vue";
import { Notify } from "quasar";
import { useStore } from "vuex";
export default {
  props: { showModal: Boolean, hideModal: Function },

  setup(props) {
    const store = useStore();
    const userTypes = ["Sales", "Auditor", "Admin"];
    const formData = reactive({
      phoneNo: "2519",
      status: "registered",
      businessId: null,
      referenceNo: "",
    });
    const validateMask = (val) => {
      //Doesn't have _ and has something else
      return !/\_/.test(val) && /[^_]+/.test(val);
    };
    const validatePhoneNo = (val) => {
      return validateMask(val) && /^\(251\)\s9/.test(val);
    };

    return {
      formData,
      submitting: computed(() => store.state.auth.submitting),
      userTypes,
      validateMask,
      validatePhoneNo,
      isValidEmail(email) {
        const re =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
      },
      submitForm: async () => {
        const res = formData.phoneNo.split("-");
        const initial = res[0].substring(6, 9);
        const main = res[1].trim();
        const phoneNo = `0${initial}${main}`;
        await store.dispatch("auth/registerTransaction", {
          ...formData,
          phoneNo,
        });
        formData.phoneNo = "2519";
        formData.referenceNo = "";
        formData.businessId = null;
        props.hideModal();
      },
    };
  },
};
</script>

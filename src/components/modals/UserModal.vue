<template>
  <q-dialog v-model="showModal" @hide="hideModal">
    <q-card>
      <q-card-section class="q-pt-none">
        <q-card-section class="row">
          <div class="text-h6">Register User</div>
          <q-space />
          <q-btn flat round dense icon="close" @click="hideModal" />
        </q-card-section>
        <q-form @submit="submitForm">
          <div class="row q-mb-sm">
            <q-input
              style="width: 100%"
              v-model="formData.fullName"
              label="Full Name"
              :rules="[
                (val) =>
                  val.length > 1 || 'Name must have at least 2 characters.',
              ]"
            />
          </div>

          <div class="row q-mb-sm">
            <q-input
              style="width: 100%"
              v-model="formData.email"
              label="Email"
              :rules="[(val) => isValidEmail(val) || 'Email must be valid.']"
            />
          </div>
          <div class="row q-mb-sm">
            <q-select
              style="width: 100%"
              v-model="formData.userType"
              :options="userTypes"
              label="User Type"
              :rules="[(val) => val.length > 1 || 'User type is required']"
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
          <div class="row q-mb-sm">
            <q-radio v-model="formData.status" val="active" label="Active" />
            <q-radio
              v-model="formData.status"
              val="disabled"
              label="Disabled"
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
    const userTypes = ["Sales", "Auditor", "Admin"];
    const formData = reactive({
      fullName: "",
      email: "",
      userType: "",
      phoneNo: "251932508181",
      status: "active",
      uid: null,
      businessId: null,
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
        store.dispatch("auth/registerUser", formData);
      },
    };
  },
};
</script>

<style></style>

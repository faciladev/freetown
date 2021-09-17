<template>
  <q-dialog v-model="editModal" @hide="hideModal">
    <q-card>
      <q-card-section class="q-pt-none">
        <q-card-section class="row">
          <div class="text-h6">Edit User</div>
          <q-space />
          <q-btn flat round dense icon="close" @click="hideModal" />
        </q-card-section>
        <q-form @submit="submitForm">
          <div class="row q-mb-sm">
            <q-input
              style="width: 100%"
              v-model="userToSubmit.fullName"
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
              v-model="userToSubmit.email"
              label="Email"
              :rules="[(val) => isValidEmail(val) || 'Email must be valid.']"
            />
          </div>
          <div class="row q-mb-sm">
            <q-select
              style="width: 100%"
              v-model="userToSubmit.userType"
              :options="userTypes"
              label="User Type"
              :rules="[(val) => val.length > 1 || 'User type is required']"
            />
          </div>
          <div class="row q-mb-sm">
            <q-input
              style="width: 100%"
              v-model="userToSubmit.phoneNo"
              label="Cell Phone"
              fill-mask
              mask="(###) ### - ######"
            />
          </div>
          <div class="row q-mb-sm">
            <q-radio
              v-model="userToSubmit.status"
              val="active"
              label="Active"
            />
            <q-radio
              v-model="userToSubmit.status"
              val="disabled"
              label="Disabled"
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
    user: Object,
  },

  setup(props) {
    const store = useStore();
    let userToSubmit = reactive(Object.assign({}, props.user));
    const submitting = ref(false);
    const userTypes = ["Sales", "Auditor", "Admin"];

    return {
      userToSubmit,
      submitting,
      userTypes,
      isValidEmail(email) {
        const re =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
      },
      submitForm: async () => {
        submitting.value = true;
        await store.dispatch("auth/editUser", userToSubmit);
        submitting.value = false;
        props.hideModal();

        Notify.create("Successfully Updated!");
      },
    };
  },
};
</script>

<style></style>

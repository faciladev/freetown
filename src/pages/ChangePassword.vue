<template>
  <q-page padding>
    <q-card class="auth-tabs">
      <q-form @submit="submitForm">
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="password" label="Change Password" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="password">
            <q-input
              v-model="currentPassword"
              type="password"
              label="Current Password"
              :rules="[
                (val) =>
                  val.length >= 6 || 'Please enter at least 6 characters',
              ]"
            />
            <q-input
              v-model="newPassword"
              type="password"
              label="New Password"
              :rules="[
                (val) =>
                  val.length >= 6 || 'Please enter at least 6 characters',
              ]"
            />
            <q-input
              v-model="newPassword2"
              type="password"
              label="Repeat New Password"
              :rules="[
                (val) => !isRepeatedPassword() || 'Passwords should match.',
              ]"
            />
          </q-tab-panel>
        </q-tab-panels>
        <div class="text-center">
          <q-btn
            :loading="submitting"
            type="submit"
            color="primary"
            label="Save"
            icon="save"
            class="q-mb-lg"
          />
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";
export default {
  setup(props) {
    const store = useStore();
    const tab = ref("password");
    const currentPassword = ref("");
    const newPassword = ref("");
    const newPassword2 = ref("");
    return {
      tab,
      currentPassword,
      newPassword,
      newPassword2,
      submitting: computed(() => store.state.auth.submitting),
      submitForm: () => {
        store.dispatch("auth/changePassword", {
          currentPassword: currentPassword.value,
          newPassword: newPassword.value,
        });
      },
      isRepeatedPassword: () => {
        return newPassword === newPassword2;
      },
    };
  },
};
</script>

<style>
.auth-tabs {
  max-width: 600px;
  margin: 0 auto;
}
.save-btn {
  display: flex;
  justify-content: center !important;
}
</style>

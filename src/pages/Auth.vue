<template>
  <q-page padding>
    <q-card class="auth-tabs">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="login" label="Login" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="login">
          <q-form @submit="submitForm">
            <div class="row q-mb-md">
              <q-input
                class="col"
                outlined
                v-model="formData.email"
                label="Email"
                stack-label
                lazy-rules
                :rules="[
                  (val) =>
                    isValidEmailAddress(val) ||
                    'Please enter a valid email address.',
                ]"
              />
            </div>
            <div class="row q-mb-md">
              <q-input
                class="col"
                outlined
                type="password"
                lazy-rules
                :rules="[
                  (val) =>
                    val.length >= 6 || 'Please enter at least 6 characters',
                ]"
                v-model="formData.password"
                label="Password"
                stack-label
              />
            </div>
            <div class="row q-mb-md">
              <q-space />
              <q-btn color="primary" type="submit" :label="tab" />
            </div>
          </q-form>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script>
import { ref, reactive } from "vue";
import { useStore } from "vuex";
export default {
  setup() {
    const store = useStore();
    const tab = ref("login");
    const formData = reactive({ email: "", password: "" });
    return {
      isValidEmailAddress: (email) => {
        const re =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
      },
      formData,
      tab,
      submitForm: () => {
        store.dispatch("auth/loginUser", formData);
        // loginUser(formData);
      },
    };
  },
};
</script>
<style>
.auth-tabs {
  max-width: 500px;
  margin: 0 auto;
}
</style>

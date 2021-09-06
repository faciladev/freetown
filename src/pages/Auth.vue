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
            <!-- <div class="row q-mb-md">
              <q-banner class="bg-grey-3 col">
                <template v-slot:avatar>
                  <q-icon name="account_circle" color="primary" />
                </template>
                Login to to Free Town!
              </q-banner>
            </div> -->
            <div class="row q-mb-md">
              <q-input
                class="col"
                outlined
                v-model="formData.email"
                label="Email"
                stack-label
                lazy-rules
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
import { ref } from "vue";
export default {
  setup(props) {
    return {
      isValidEmailAddress: () => {},
      formData: { email: "" },
      tab: ref("login"),
      submitForm: () => {},
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

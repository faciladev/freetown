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
        <q-tab name="basic" label="Basic Information" />
        <q-tab name="password" label="Password" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="basic">
          <q-input v-model="ph" label="Full Name" />
          <q-input v-model="ph" label="Telephone" />
          <q-input v-model="ph" label="Username" />
        </q-tab-panel>

        <q-tab-panel name="password">
          <q-input v-model="ph" type="password" label="Old Password" />
          <q-input v-model="ph" type="password" label="New Password" />
          <q-input v-model="ph" type="password" label="Repeat New Password" />
        </q-tab-panel>

        <q-tab-panel name="template">
          <q-input v-model="text" autogrow label="Reward Winner SMS" />
          <q-input v-model="text" autogrow label="የአሸናፊ መልእክት በአማርኛ" />
        </q-tab-panel>
      </q-tab-panels>
      <div class="text-center">
        <q-btn color="primary" label="Save" icon="save" class="q-mb-lg" />
      </div>
    </q-card>
  </q-page>
</template>

<script>
import { ref } from "vue";
export default {
  setup(props) {
    const tab = ref("basic");
    return {
      tab,
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

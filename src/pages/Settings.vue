<template>
  <q-page padding>
    <transition
      appear
      enter-active-class="animated zoomIn"
      leave-active-class="animated zoomOut"
    >
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
          <q-tab name="amount" label="Amount" />
          <q-tab name="percentage" label="Percentage" />
          <q-tab name="template" label="Templates" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="amount">
            <q-input v-model="ph" type="number" label="Minimum Amount" />
            <q-input v-model="ph" type="number" label="Maximum Amount" />
          </q-tab-panel>

          <q-tab-panel name="percentage">
            <q-input v-model="ph" type="number" label="Morning Percentage" />
            <q-input v-model="ph" type="number" label="Afternoon Percentage" />
            <q-input v-model="ph" type="number" label="Evening Percentage" />
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
    </transition>
  </q-page>
</template>

<script>
import { ref } from "vue";
export default {
  setup(props) {
    const tab = ref("amount");
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

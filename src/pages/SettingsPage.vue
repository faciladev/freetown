<template>
  <q-page padding>
    <transition
      appear
      enter-active-class="animated zoomIn"
      leave-active-class="animated zoomOut"
    >
      <q-card class="auth-tabs">
        <q-form @submit="formSubmit">
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
            <q-tab name="template" label="SMS" />
          </q-tabs>

          <q-separator />
          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="amount">
              <q-input
                :model-value="settings.amount.min"
                @update:model-value="setMinAmntStng"
                type="number"
                label="Minimum Amount"
                :rules="[
                  (val) =>
                    validateNumber(val) || 'Please enter a valid number.',
                ]"
              />
              <q-input
                :model-value="settings.amount.max"
                @update:model-value="setMaxAmntStng"
                type="number"
                label="Maximum Amount"
                :rules="[
                  (val) =>
                    validateNumber(val) || 'Please enter a valid number.',
                ]"
              />
            </q-tab-panel>

            <q-tab-panel name="percentage">
              <q-input
                :model-value="settings.percent.morning"
                @update:model-value="setMornPercStng"
                type="number"
                label="Morning Percentage"
                :rules="[
                  (val) =>
                    validateNumber(val) || 'Please enter a valid number.',
                ]"
              />
              <q-input
                :model-value="settings.percent.afternoon"
                @update:model-value="setAftrPercStng"
                type="number"
                label="Afternoon Percentage"
                :rules="[
                  (val) =>
                    validateNumber(val) || 'Please enter a valid number.',
                ]"
              />
              <q-input
                :model-value="settings.percent.night"
                @update:model-value="setNightPercStng"
                type="number"
                label="Evening Percentage"
                :rules="[
                  (val) =>
                    validateNumber(val) || 'Please enter a valid number.',
                ]"
              />
            </q-tab-panel>

            <q-tab-panel name="template">
              <q-input
                :model-value="settings.sms.eng"
                @update:model-value="setEngSMSStng"
                autogrow
                label="Winner SMS English"
                :rules="[(val) => val.length > 1 || 'SMS must not be empty.']"
              />
              <q-input
                :model-value="settings.sms.amh"
                @update:model-value="setAmhSMSStng"
                autogrow
                label="የአሸናፊ መልእክት በአማርኛ"
                :rules="[(val) => val.length > 1 || 'SMS must not be empty.']"
              />
              <div class="text-center">
                <p>Default Language</p>
                <q-radio
                  :model-value="settings.sms.defaultLang"
                  @update:model-value="setDefaultLang"
                  val="eng"
                  label="English"
                />
                <q-radio
                  :model-value="settings.sms.defaultLang"
                  @update:model-value="setDefaultLang"
                  val="amh"
                  label="Amharic"
                />
              </div>
            </q-tab-panel>
          </q-tab-panels>
          <div class="text-center">
            <q-btn
              type="submit"
              :loading="submitting"
              color="primary"
              label="Save"
              icon="save"
              class="q-mb-lg"
            />
          </div>
        </q-form>
      </q-card>
    </transition>
  </q-page>
</template>

<script>
import { reactive, ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { LocalStorage } from "quasar";

export default {
  setup() {
    const store = useStore();
    const settings = computed(() => store.state.auth.settings);

    return {
      submitting: computed(() => store.state.auth.submitting),
      settings,
      setDefaultLang: (val) => {
        store.dispatch("auth/setDefaultLangStng", val);
      },
      setMinAmntStng: (val) => {
        store.dispatch("auth/setMinAmntStng", val);
      },
      setMaxAmntStng: (val) => {
        store.dispatch("auth/setMaxAmntStng", val);
      },
      setMornPercStng: (val) => {
        store.dispatch("auth/setMornPercStng", val);
      },
      setAftrPercStng: (val) => {
        store.dispatch("auth/setAftrPercStng", val);
      },
      setNightPercStng: (val) => {
        store.dispatch("auth/setNightPercStng", val);
      },
      setEngSMSStng: (val) => {
        store.dispatch("auth/setEngSMSStng", val);
      },
      setAmhSMSStng: (val) => {
        store.dispatch("auth/setAmhSMSStng", val);
      },
      tab: ref("amount"),
      validateNumber: (val) => {
        if (isNaN(parseInt(val))) {
          return false;
        }
        return true;
      },
      formSubmit: () => {
        store.dispatch("auth/setSettings");
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

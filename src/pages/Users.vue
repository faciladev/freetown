<template>
  <q-page>
    <div class="q-pa-md absolute full-width full-height column">
      <div class="row q-mb-lg">
        <q-input
          class="col"
          v-model="searchField"
          outlined
          @keyup.esc="searchField = ''"
          label="Search"
          clearable
        />
      </div>
      <!-- <p>No Search Results</p> -->
      <q-scroll-area class="q-scroll-area">
        <transition
          appear
          enter-active-class="animated zoomIn"
          leave-active-class="animated zoomOut"
        >
          <div>
            <q-banner
              inline-actions
              class="list-header text-white text-center bg-secondary"
            >
              <span class="text-bold text-subtitle1">Users</span>
            </q-banner>
            <q-list bordered separator>
              <q-item clickable v-ripple class="bg-red-1">
                <q-item-section>Fasil Girma</q-item-section>
                <q-item-section>fasil23</q-item-section>
                <q-item-section>Sales Person</q-item-section>
                <q-item-section>(251)-932-508181</q-item-section>
                <q-item-section side>
                  <div class="row">
                    <q-btn
                      @click.stop="showEditModal"
                      flat
                      round
                      dense
                      color="primary"
                      icon="edit"
                    />
                    <q-btn
                      @click.stop="promptToDelete(1)"
                      flat
                      round
                      dense
                      color="primary"
                      icon="delete"
                    />
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </transition>
      </q-scroll-area>

      <div class="absolute-bottom text-center q-mb-lg no-pointer-events">
        <q-btn
          @click="showModal = true"
          round
          style="align-item: center"
          class="all-pointer-events"
          color="primary"
          size="24px"
          icon="add"
        />
      </div>
    </div>
    <q-dialog v-model="showModal">
      <q-card>
        <q-card-section class="row">
          <div class="text-h6">Register</div>
          <q-space />
          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>
        <q-form @submit="submitCustomer">
          <q-card-section class="q-pt-none">
            <div class="row q-mb-sm">
              <q-input v-model="name" label="Full Name" />
            </div>
            <div class="row q-mb-sm">
              <q-input v-model="name" label="Username" />
            </div>
            <div class="row q-mb-sm">
              <q-select
                style="width: 100%"
                v-model="selectModel"
                :options="options"
                label="User Type"
              />
            </div>
            <div class="row q-mb-sm">
              <q-input
                v-model="phone"
                label="Cell Phone"
                fill-mask
                mask="(###) ### - ######"
              />
            </div>
            <div class="row q-mb-sm">
              <q-radio v-model="userStatus" val="active" label="Active" />
              <q-radio v-model="userStatus" val="disabled" label="Disabled" />
            </div>
            <q-card-actions align="center">
              <q-btn
                type="submit"
                :loading="loading"
                label="Register"
                class="q-mt-md right"
                color="primary"
              />
            </q-card-actions>
          </q-card-section>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import { showErrorMessage } from "src/functions/function-show-error";
export default defineComponent({
  setup(props) {
    const loading = ref(false);
    const showModal = ref(false);
    const selectModel = ref("Sales Person");
    const userStatus = ref("active");

    return {
      searchField: "",
      options: [],
      sortBy: {},
      showModal,
      promo: {},
      selectModel,
      userStatus,
      options: ["Sales Person", "Auditor"],
      loading,
      showEditModal: () => (showModal.value = true),
      promptToDelete(id) {
        this.$q
          .dialog({
            title: "Confirm",
            message: "Would you like to delete this?",
            cancel: true,
            persistent: true,
          })
          .onOk(() => {
            // this.deleteDeal(id);
          });
      },
      submitCustomer: () => {
        loading.value = true;
        setTimeout(() => {
          //   Notify.create("Submitted!");
          loading.value = false;
          showErrorMessage("Some Error!");
          showModal.value = false;
        }, 1000);
      },
      phone: ref("2519"),
      reference: ref(""),
    };
  },
});
</script>

<style scoped>
.q-scroll-area {
  display: flex;
  flex-grow: 1;
}
</style>

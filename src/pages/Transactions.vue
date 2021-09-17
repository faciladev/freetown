<template>
  <q-page>
    <div class="q-pa-md absolute full-width full-height column">
      <div class="row q-mb-lg action-menu">
        <q-btn
          color="primary"
          label="Verify"
          icon="attachment"
          @click="showVerifyModal"
        />
        &nbsp;&nbsp;
        <q-btn
          @click="showRedeemModal"
          color="primary"
          label="Redeem"
          icon="crop_free"
        />
        &nbsp;&nbsp;
        <q-btn
          @click="showRewardModal"
          color="primary"
          label="Reward"
          icon="thumb_up"
        />
      </div>
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
              <span class="text-bold text-subtitle1">Transactions</span>
            </q-banner>
            <q-list bordered separator>
              <q-item clickable v-ripple class="bg-red-1">
                <q-item-section
                  >CS-85352-21 | (251)-932-508181 | Registered</q-item-section
                >
                <q-item-section side>
                  <div class="row">
                    <q-btn
                      @click.stop="showEditModal"
                      flat
                      round
                      dense
                      color="primary"
                      icon="crop_free"
                    />
                    <q-btn
                      @click.stop="showEditModal"
                      flat
                      round
                      dense
                      color="primary"
                      icon="send"
                    />
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
              <q-item clickable v-ripple class="bg-red-1">
                <q-item-section
                  >CS-85352-21 | (251)-932-508181 | Registered</q-item-section
                >
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
          <div class="text-h6">Register Transaction</div>
          <q-space />
          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>
        <q-form @submit="submitCustomer">
          <q-card-section class="q-pt-none">
            <div class="row q-mb-sm">
              <q-input
                v-model="phone"
                label="Cell Phone"
                fill-mask
                hint="Cell Phone: (251) 911 - 222222"
                mask="(###) ### - ######"
              />
            </div>
            <div class="row q-mb-sm">
              <q-input
                type="text"
                mask="#####"
                v-model="reference"
                label="Reference No."
                fill-mask
                hint="Ref: 20865"
              />
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
    <q-dialog v-model="showVerify">
      <q-card>
        <q-card-section class="row">
          <div class="text-h6">Verify Transaction</div>
          <q-space />
          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>
        <q-form @submit="submitCustomer">
          <q-card-section class="q-pt-none">
            <q-uploader
              url="https://freetownapp.herokuapp.com/upload"
              label="Upload Sales File"
              square
              flat
              bordered
              style="max-width: 300px"
            />
            <!-- <q-card-actions align="center">
              <q-btn
                type="submit"
                :loading="loading"
                label="Register"
                class="q-mt-md right"
                color="primary"
              />
            </q-card-actions> -->
          </q-card-section>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showReward">
      <q-card>
        <q-card-section class="row">
          <div class="text-h6">Reward Transaction</div>
          <q-space />
          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>
        <q-list>
          <q-item>
            <!-- <q-item-section avatar>
              <q-icon color="primary" name="local_bar" />
            </q-item-section> -->
            <q-item-section>
              <q-item-label>(251)-932-508181</q-item-label>
              <q-item-label caption>Phone No.</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <!-- <q-item-section avatar>
              <q-icon color="primary" name="local_bar" />
            </q-item-section> -->
            <q-item-section>
              <q-item-label>CS-10001-21</q-item-label>
              <q-item-label caption>Reference No.</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <!-- <q-item-section avatar>
              <q-icon color="primary" name="local_bar" />
            </q-item-section> -->
            <q-item-section>
              <q-item-label>304.00</q-item-label>
              <q-item-label caption>Bill Amount.</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <!-- <q-item-section avatar>
              <q-icon color="primary" name="local_bar" />
            </q-item-section> -->
            <q-item-section>
              <q-item-label>50%</q-item-label>
              <q-item-label caption>Reward by Percent</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <q-item>
          <!-- <q-item-section avatar>
              <q-icon color="primary" name="local_bar" />
            </q-item-section> -->
          <q-item-section>
            <q-item-label>152.00</q-item-label>
            <q-item-label caption>Reward Amount</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator />

        <q-card-actions class="action-menu q-ma-md">
          <q-btn color="primary">Send </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showRedeem">
      <q-card>
        <q-card-section class="row">
          <div class="text-h6">Redeem Transaction</div>
          <q-space />
          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>
        <q-form @submit="submitCustomer">
          <q-card-section class="q-pt-none">
            <q-card-actions align="center">
              <q-btn
                type="submit"
                :loading="loading"
                class="q-mt-md right"
                color="primary"
                label="SCAN QR CODE"
                icon="crop_free"
              />
            </q-card-actions>
            <p class="q-mt-lg text-center">OR</p>
            <q-card-actions align="center" class="column">
              <q-input v-model="code" label="Enter CODE" />
              <q-btn
                type="submit"
                :loading="loading"
                label="REDEEM"
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
import { defineComponent, ref, onBeforeUnmount, computed } from "vue";
import { showErrorMessage } from "src/functions/function-show-error";
export default defineComponent({
  setup(props) {
    const loading = ref(false);
    const showModal = ref(false);
    const showVerify = ref(false);
    const showRedeem = ref(false);
    const showReward = ref(false);

    return {
      searchField: "",
      options: [],
      sortBy: {},
      showModal,
      promo: {},
      loading,
      showVerify,
      showRedeem,
      showReward,
      showVerifyModal: () => {
        showVerify.value = true;
      },
      showEditModal: () => (showModal.value = true),
      showRedeemModal: () => (showRedeem.value = true),
      showRewardModal: () => (showReward.value = true),
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
      code: ref(""),
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
.action-menu {
  justify-content: center;
}
</style>

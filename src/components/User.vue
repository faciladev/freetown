<template>
  <q-item clickable v-ripple class="bg-red-1">
    <q-item-section
      class="highlightable"
      v-html="$options.filters.searchHighlight(user.fullName, search)"
    ></q-item-section>
    <q-item-section
      class="highlightable"
      v-html="$options.filters.searchHighlight(user.phoneNo, search)"
    ></q-item-section>
    <!-- <q-item-section
      class="highlightable"
      v-html="$options.filters.searchHighlight(user.email, search)"
    ></q-item-section> -->
    <!-- <q-item-section
      class="highlightable"
      v-html="$options.filters.searchHighlight(user.userType, search)"
    ></q-item-section> -->
    <q-item-section side>
      <div class="row">
        <q-btn
          @click.stop="selectUser(user)"
          flat
          round
          dense
          color="primary"
          icon="edit"
        />
        <!-- <q-btn
          @click.stop="promptToDelete(user.id)"
          flat
          round
          dense
          color="primary"
          icon="delete"
        /> -->
      </div>
    </q-item-section>
    <EditUserModal
      :editModal="editModal"
      :hideModal="hideEditModal"
      :user="user"
    />
  </q-item>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import EditUserModal from "src/components/modals/EditUserModal.vue";
export default {
  components: { EditUserModal },
  props: { user: Object },
  setup(props) {
    const store = useStore();

    const editModal = ref(false);
    const showEditModal = () => {
      console.log("showEditModal");
      editModal.value = true;
    };
    return {
      search: computed(() => store.state.auth.search),
      editModal,
      hideEditModal: () => {
        editModal.value = false;
      },
      selectUser: (user) => {
        console.log(user.uid);
        store.dispatch("auth/selectUser", user);
        showEditModal();
      },
      //   showEditModal,
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
    };
  },
  filters: {
    searchHighlight(value, search) {
      if (search) {
        let searchRegExp = new RegExp(search, "ig");
        return value.replace(searchRegExp, (match) => {
          return "<span class='bg-yellow-6'>" + match + "</span>";
        });
      }
      return value;
    },
  },
};
</script>

<style scoped>
.highlightable {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>

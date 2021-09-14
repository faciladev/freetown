<template>
  <q-input
    type="search"
    class="col"
    :model-value="searchField"
    @update:model-value="updateSearch"
    outlined
    v-select-all
    @keyup.esc="updateSearch('')"
    label="Search"
    clearable
  />
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { debounce } from "quasar";
import { selectAll } from "src/directives/directive-select-all";
export default {
  props: { searchItem: String },
  setup(props) {
    const store = useStore();
    const router = useRouter();
    return {
      searchField: computed(() => store.state.auth.search),
      updateSearch: debounce((value) => {
        //Query database populate search result
        store.dispatch("auth/search", {
          searchTerm: value,
          searchItem: props.searchItem,
          router,
        });
      }),
    };
  },
  directives: {
    selectAll,
  },
};
</script>

<style></style>

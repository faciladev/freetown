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
import { selectAll } from "src/directives/directive-select-all";
export default {
  props: { updateSearch: Function },
  setup(props) {
    const store = useStore();
    return {
      searchField: computed(() => store.state.auth.search),
    };
  },
  directives: {
    selectAll,
  },
};
</script>

<style></style>

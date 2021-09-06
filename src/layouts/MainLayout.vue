<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title class="absolute-center"> Free Town </q-toolbar-title>

        <q-btn
          color="white"
          label="Fasil"
          flat
          icon-right="account_circle"
          class="absolute-right"
        >
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item clickable v-close-popup>
                <q-item-section>Edit Profile</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>Setting</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup>
                <q-item-section>Logout</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
        <!-- <q-btn
          v-if="!loggedIn"
          flat
          to="/auth"
          class="absolute-right"
          icon-right="account_circle"
          label="Login"
        />
        <q-btn
          v-else
          flat
          class="absolute-right"
          icon-right="account_circle"
          label="Logout"
          @click="logoutUser"
        /> -->
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-secondary"
    >
      <q-list dark>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from "components/EssentialLink.vue";

const linksList = [
  {
    title: "Home",
    caption: "Transactions",
    icon: "home",
    link: "#/",
  },
  {
    title: "Settings",
    caption: "Reward Settings",
    icon: "settings",
    link: "#/settings",
  },
  {
    title: "Users",
    caption: "Registered Users",
    icon: "people",
    link: "#/users",
  },
];

import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      loggedIn: null,
      logoutUser: null,
    };
  },
});
</script>

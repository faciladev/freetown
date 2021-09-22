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
          v-if="!loggedIn"
          flat
          to="/auth"
          class="absolute-right"
          icon-right="account_circle"
          label="Login"
        />
        <q-btn
          v-else
          color="white"
          :label="displayName(loggedInUser)"
          flat
          icon-right="account_circle"
          class="absolute-right"
        >
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item clickable v-close-popup to="/change-password">
                <q-item-section>Change Password</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup>
                <q-item-section @click="logoutUser">Logout</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>

        <!-- <q-btn
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
        <q-item-label header> Navigation </q-item-label>
        <EssentialLink
          v-for="link in securedLinks(loggedInUser)"
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
    caption: "Menu",
    icon: "home",
    link: "#/",
  },
  {
    title: "Transactions",
    caption: "Transactions",
    icon: "attach_money",
    link: "#/transactions",
  },
  {
    title: "Redeem",
    caption: "Redeem Transaction",
    icon: "crop_free",
    link: "#/redeem",
  },
  {
    title: "Audit",
    caption: "Verify Transactions",
    icon: "check",
    link: "#/audit",
  },

  {
    title: "Reports",
    caption: "Report View",
    icon: "calendar_view_month",
    link: "#/reports",
  },
  {
    title: "Settings",
    caption: "Settings",
    icon: "settings",
    link: "#/settings",
  },
  {
    title: "Users",
    caption: "Registered Users",
    icon: "people",
    link: "#/users",
  },
  // {
  //   title: "Report",
  //   caption: "Report View",
  //   icon: "assessment",
  //   link: "#/reports",
  // },
];

import { defineComponent, ref, computed, onMounted } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);
    const store = useStore();

    const loggedInUser = computed(() => store.state.auth.loggedInUser);
    const securityRule = {
      Sales: ["Home", "Transactions", "Redeem"],
      Auditor: ["Home", "Transactions", "Redeem", "Audit"],
      Admin: [
        "Home",
        "Transactions",
        "Redeem",
        "Audit",
        "Reports",
        "Settings",
        "Reports",
        "Users",
      ],
    };
    const securedLinks = (loggedInUser) => {
      return loggedInUser && loggedInUser.userType
        ? linksList.filter(
            (link) =>
              securityRule[loggedInUser.userType].indexOf(link.title) != -1
          )
        : [];
    };

    return {
      securedLinks,
      displayName: (loggedInUser) => {
        let displayName = "";
        if (!loggedInUser.fullName) return "";

        if (loggedInUser.fullName.indexOf(" ") === -1) {
          displayName = loggedInUser.fullName.substring(0, 10);
        } else {
          [displayName] = loggedInUser.fullName.split(" ");
        }
        return displayName;
      },
      loggedInUser,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      loggedIn: computed(() => store.state.auth.loggedIn),
      logoutUser: () => store.dispatch("auth/logoutUser"),
    };
  },
});
</script>
<style lang="scss">
.q-drawer {
  .q-router-link--exact-active {
    color: white !important;
  }
}
</style>

const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      // { path: "", component: () => import("src/pages/Transactions.vue") },
      { path: "/", component: () => import("src/pages/HomePage.vue") },
      {
        path: "/transactions",
        component: () => import("src/pages/TransactionPage.vue"),
      },
      { path: "/redeem", component: () => import("pages/RedeemPage.vue") },
      { path: "/audit", component: () => import("pages/AuditPage.vue") },
      { path: "/reward", component: () => import("pages/RewardPage.vue") },
      { path: "/auth", component: () => import("pages/Auth.vue") },
      { path: "/users", component: () => import("src/pages/UsersPage.vue") },
      {
        path: "/reports",
        component: () => import("src/pages/ReportsPage.vue"),
      },
      {
        path: "/settings",
        component: () => import("src/pages/SettingsPage.vue"),
      },
      // { path: "/reports", component: () => import("pages/ReportsPage.vue") },
      {
        path: "/change-password",
        component: () => import("pages/ChangePassword.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;

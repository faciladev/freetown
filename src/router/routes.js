const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("src/pages/Transactions.vue") },
      { path: "/auth", component: () => import("pages/Auth.vue") },
      { path: "/users", component: () => import("src/pages/Users.vue") },
      { path: "/settings", component: () => import("pages/Settings.vue") },
      { path: "/profile", component: () => import("pages/Profile.vue") },
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

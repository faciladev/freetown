import { LocalStorage } from "quasar";
import { showErrorMessage } from "src/functions/function-show-error";
export default ({ router }) => {
  router.beforeEach((to, from, next) => {
    let loggedIn = LocalStorage.getItem("loggedIn");
    let loggedInUser = LocalStorage.getItem("loggedInUser");

    if (loggedIn && loggedInUser.status !== "active" && to.path !== "/auth") {
      showErrorMessage("Account Disabled");
      next("/auth");
    } else if (!loggedIn && to.path !== "/auth") {
      next("/auth");
    } else {
      next();
    }
  });
};

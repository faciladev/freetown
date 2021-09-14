import { LocalStorage, Loading, Notify } from "quasar";

import { auth, firebase } from "src/boot/firebase";
import { showErrorMessage } from "src/functions/function-show-error";
import {
  addUserAPI,
  getAllUsersAPI,
  getAllTransactionsAPI,
  getUserAPI,
  editUserAPI,
  editTransactionAPI,
  searchUsersAPI,
  searchTransactionsAPI,
  setSettingsAPI,
  loadSettingsAPI,
  addTransactionAPI,
  getBankAPI,
} from "src/api/userAPI";
const state = {
  loggedIn: false,
  loggedInUser: null,
  users: null,
  transactions: null,
  selectedUser: null,
  selectedTransaction: null,
  submitting: false,
  search: "",
  lastDocField: "fullName",
  lastDocFieldTrans: "referenceNo",
  lastDocVal: "A",
  lastDocValTrans: 0,
  settings: {
    id: null,
    amount: { min: 0, max: 0 },
    percent: { morning: 0, afternoon: 0, night: 0 },
    sms: { eng: "", amh: "" },
  },
  bank: null,
};

const mutations = {
  setBank(state, value) {
    state.bank = value;
  },
  selectUser(state, value) {
    state.selectedUser = value;
    console.log("selectedUser: ", value);
  },
  selectTransaction(state, value) {
    state.selectedTransaction = value;
  },
  setLoggedIn(state, value) {
    state.loggedIn = value;
  },
  setAllTransactions(state, value) {
    if (state.transactions === null) {
      state.transactions = value;
    } else {
      console.log(state.transactions);
      state.transactions.push(...value);
    }
  },
  setAllUsers(state, value) {
    if (state.users === null) {
      state.users = value;
    } else {
      console.log(state.users);
      state.users.push(...value);
    }
  },
  clearUsers(state) {
    state.users = null;
  },
  clearTransactions(state) {
    state.transactions = null;
  },
  setLoggedInUser(state, value) {
    state.loggedInUser = value;
  },
  setSubmitting(state, value) {
    state.submitting = value;
  },
  setSearch(state, value) {
    state.search = value;
  },
  setLastDocVal(state, value) {
    console.log("setLastDocVal", value);
    state.lastDocVal = value;
  },
  setLastDocValTrans(state, value) {
    console.log("setLastDocValTrans", value);
    state.lastDocValTrans = value;
  },
  setSettings(state, payload) {
    if (!payload) {
      state.settings = {
        id: null,
        amount: { min: 0, max: 0 },
        percent: { morning: 0, afternoon: 0, night: 0 },
        sms: { eng: "", amh: "" },
      };
    } else if (payload.item == "min") {
      state.settings.amount.min = payload.val;
    } else if (payload.item == "max") {
      state.settings.amount.max = payload.val;
    } else if (payload.item == "morning") {
      state.settings.percent.morning = payload.val;
    } else if (payload.item == "afternoon") {
      state.settings.percent.afternoon = payload.val;
    } else if (payload.item == "night") {
      state.settings.percent.night = payload.val;
    } else if (payload.item == "smsEng") {
      state.settings.sms.eng = payload.val;
    } else if (payload.item == "smsAmh") {
      state.settings.sms.amh = payload.val;
    } else if (payload.item == "id") {
      state.settings.id = payload.val;
    } else if (payload.item == "init") {
      state.settings = payload.val;
    }
    console.log("settings: ", state.settings);
  },
};

const actions = {
  getBank: ({ commit }) => {
    getBankAPI(function (response) {
      const business = response.data();
      commit("setBank", business.bank);
      // console.log("callback", business.data());
    });
    // .then((res) => {
    //   console.log("BankBal,", res.bank);
    //   commit("setBank", res.bank);
    // })
    // .catch((e) => {
    //   console.error(e);
    //   showErrorMessage(e.message);
    // });
  },
  setMinAmntStng: ({ commit }, payload) => {
    commit("setSettings", { item: "min", val: payload });
  },
  setMaxAmntStng: ({ commit }, payload) => {
    commit("setSettings", { item: "max", val: payload });
  },
  setMornPercStng: ({ commit }, payload) => {
    commit("setSettings", { item: "morning", val: payload });
  },
  setAftrPercStng: ({ commit }, payload) => {
    commit("setSettings", { item: "afternoon", val: payload });
  },
  setNightPercStng: ({ commit }, payload) => {
    commit("setSettings", { item: "night", val: payload });
  },
  setEngSMSStng: ({ commit }, payload) => {
    commit("setSettings", { item: "smsEng", val: payload });
  },
  setAmhSMSStng: ({ commit }, payload) => {
    commit("setSettings", { item: "smsAmh", val: payload });
  },
  setSettings: async ({ commit, state }) => {
    commit("setSubmitting", true);
    const settingId = await setSettingsAPI(state.settings);
    commit("setSettings", { item: "id", val: settingId });
    commit("setSubmitting", false);

    Notify.create("Setting updated!");
    console.log("settingId", settingId);
  },
  loadSettings: async ({ commit }) => {
    const settings = await loadSettingsAPI();
    console.log("settingsAPI", settings);
    commit("setSettings", { item: "init", val: settings });
  },
  async search({ commit }, payload) {
    commit("setSearch", payload.searchTerm);
    if (payload.searchItem === "user") {
      if (payload.searchTerm) {
        const users = await searchUsersAPI(payload.searchTerm);
        commit("clearUsers");
        commit("setAllUsers", users);
      } else {
        //Search term is empty
        commit("clearUsers");
        payload.router.go();
      }
    } else if (payload.searchItem === "transaction") {
      if (payload.searchTerm) {
        const transactions = await searchTransactionsAPI(payload.searchTerm);
        commit("clearTransactions");
        commit("setAllTransactions", transactions);
      } else {
        //Search term is empty
        commit("clearTransactions");
        payload.router.go();
      }
    }
  },
  async editUser({ commit }, user) {
    await editUserAPI(user);
    // commit("editUser", user);
  },
  async editTransaction({ commit }, user) {
    await editTransactionAPI(user);
  },
  selectUser({ commit }, user) {
    commit("selectUser", user);
  },
  selectTransaction({ commit }, transaction) {
    commit("selectTransaction", transaction);
  },
  async getAllTransactions({ commit, state }, done) {
    const transactions = await getAllTransactionsAPI(
      state.lastDocFieldTrans,
      state.lastDocValTrans
    );
    console.log("transactions", transactions);
    if (transactions.length > 0) {
      //Check if same request is fired more than once
      if (
        state.lastDocVal !==
        transactions[transactions.length - 1][state.lastDocFieldTrans]
      ) {
        commit(
          "setLastDocValTrans",
          transactions[transactions.length - 1][state.lastDocFieldTrans]
        );
        commit("setAllTransactions", transactions);
        done();
      }
    } else {
      //End of result set
      done(true);
    }
  },
  async getAllUsers({ commit, state }, done) {
    const users = await getAllUsersAPI(state.lastDocField, state.lastDocVal);
    if (users.length > 0) {
      //Check if same request is fired more than once
      if (state.lastDocVal !== users[users.length - 1][state.lastDocField]) {
        commit("setLastDocVal", users[users.length - 1][state.lastDocField]);
        commit("setAllUsers", users);
        done();
      }
    } else {
      //End of result set
      done(true);
    }
  },
  registerUser({ state, commit }, payload) {
    commit("setSubmitting", true);
    // Loading.show();
    //Register only using a fake password
    auth
      .createUserWithEmailAndPassword(payload.email, "12345678")
      .then((response) => {
        console.log("response", response);
        payload.uid = response.user.uid;
        //Create user profile details
        //Get businessId from current logged in user
        try {
          payload.businessId = state.loggedInUser.businessId;
          console.log("Payload", payload);
        } catch (e) {
          console.error(e);
        }

        addUserAPI(payload).then(
          (response) => {
            console.log("response", response);
            commit("setSubmitting", false);
            Notify.create("Successfully Registered!");
            return response;
          },
          (error) => {
            showErrorMessage(error.message);
          }
        );
      })
      .catch((error) => {
        showErrorMessage(error.message);
      });
  },
  async registerTransaction({ state, commit }, payload) {
    try {
      commit("setSubmitting", true);
      payload.businessId = state.loggedInUser.businessId;
      const transactionId = await addTransactionAPI(payload);
      commit("setSubmitting", false);
      Notify.create("Successfully Registered!");
      return transactionId;
    } catch (e) {
      console.error(e);
      showErrorMessage(error.message);
    }
  },
  loginUser({ commit, dispatch }, payload) {
    Loading.show();
    auth
      .signInWithEmailAndPassword(payload.email, payload.password)
      .then((response) => {
        console.log("response", response);
        //Load user profile
        getUserAPI(response.user).then(
          (response) => {
            //Set loggedInUser in LocalStorage
            const profile = {
              fullName: response.fullName,
              businessId: response.businessId,
              userType: response.userType,
            };
            //Set to storage because handleAuthStatechange is fired before
            //the above api call returns
            commit("setLoggedInUser", profile);
            LocalStorage.set("loggedInUser", profile);
          },
          (error) => {
            showErrorMessage(error.message);
          }
        );
      })
      .catch((error) => {
        showErrorMessage(error.message);
      });
  },
  logoutUser({ dispatch }) {
    auth.signOut();
  },
  handleAuthStateChange({ commit, dispatch, state }) {
    auth.onAuthStateChanged((user) => {
      Loading.hide();
      if (user) {
        console.log("handleAuthStateChange");
        // user logged in
        commit("setLoggedIn", true);
        LocalStorage.set("loggedIn", true);
        console.log("loggedInUser", LocalStorage.getItem("loggedInUser"));
        commit("setLoggedInUser", LocalStorage.getItem("loggedInUser"));

        this.$router.push("/").catch(() => {});
        // dispatch("deals/fbReadData", null, { root: true });
      } else {
        // commit("deals/clearDeals", null, {
        //   root: true,
        // });
        // commit("deals/setDealsDownloaded", false, {
        //   root: true,
        // });
        commit("setLoggedIn", false);
        LocalStorage.set("loggedIn", false);
        LocalStorage.set("loggedInUser", null);
        this.$router.replace("/auth");
      }
    });
  },
  changePassword({ dispatch, state, commit }, payload) {
    commit("setSubmitting", true);
    const user = auth.currentUser;
    const credential = firebase.auth.EmailAuthProvider.credential(
      user.email,
      payload.currentPassword
    );

    user
      .reauthenticateWithCredential(credential)
      .then(() => {
        // User re-authenticated.
        user
          .updatePassword(payload.newPassword)
          .then((response) => {
            commit("setSubmitting", false);
            console.log("Password Updated");
            Notify.create("Password Updated.");
          })
          .catch((error) => {
            showErrorMessage(error.message);
            commit("setSubmitting", false);
          });
      })
      .catch((error) => {
        showErrorMessage(error.message);
        commit("setSubmitting", false);
      });
  },
};

const getters = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};

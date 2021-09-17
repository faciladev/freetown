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
  getEarliestCommissionedAPI,
  getCommissionedTransByQRAPI,
  rewardWinnerAPI,
  redeemAPI,
  getTransactionsByStatusAPI,
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
  bank: 0,
  nextWinner: null,
  hasWinner: false,
  foundTransactions: null,
  foundUsers: null,
};

const mutations = {
  setHasWinner(state, value) {
    state.hasWinner = value;
  },
  setNextWinner(state, value) {
    state.nextWinner = value;
  },
  setBank(state, value) {
    state.bank = value;
  },
  selectUser(state, value) {
    state.selectedUser = value;
  },
  selectTransaction(state, value) {
    state.selectedTransaction = value;
  },
  setLoggedIn(state, value) {
    state.loggedIn = value;
  },
  setFoundUsers(state, value) {
    state.foundUsers = value;
  },
  setFoundTransactions(state, value) {
    state.foundTransactions = value;
  },
  setAllTransactions(state, value) {
    if (state.transactions === null) {
      state.transactions = value;
    } else {
      state.transactions.push(...value);
    }
  },
  setAllUsers(state, value) {
    if (state.users === null) {
      state.users = value;
    } else {
      state.users.push(...value);
    }
  },
  clearUsers(state) {
    state.users = null;
  },
  clearFoundUsers(state) {
    state.foundUsers = null;
  },
  clearTransactions(state) {
    state.transactions = null;
  },
  clearFoundTransactions(state) {
    state.foundTransactions = null;
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
    state.lastDocVal = value;
  },
  setLastDocValTrans(state, value) {
    state.lastDocValTrans = value;
  },
  setSettings(state, payload) {
    if (!payload) {
      state.settings = {
        id: null,
        amount: { min: 0, max: 0 },
        percent: { morning: 0, afternoon: 0, night: 0 },
        sms: { eng: "", amh: "", defaultLang: "eng" },
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
    } else if (payload.item == "lang") {
      state.settings.sms.defaultLang = payload.val;
    }
  },
};

const actions = {
  redeemTransaction: async ({ state }, qr) => {
    return await redeemAPI(qr);
  },
  rewardWinner: async ({ dispatch, state }, qr) => {
    //Update transaction's status to rewarded
    //update business bank by deducting bank by rewardedAmount
    await rewardWinnerAPI(
      state.bank,
      state.nextWinner,
      qr,
      state.loggedInUser.businessId
    );
    Notify.create("Successfully Rewarded!");
    dispatch("getNextWinner");
  },

  getUniqueQR: async ({ state }, length) => {
    const randomChars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    //Check if qr is unique
    let unique = false;
    while (!unique) {
      var qr = "";
      for (var i = 0; i < length; i++) {
        qr += randomChars.charAt(
          Math.floor(Math.random() * randomChars.length)
        );
      }
      const found = await getCommissionedTransByQRAPI(
        qr,
        state.loggedInUser.businessId
      );
      if (!found) {
        unique = true;
      }
    }
    return qr;
  },
  getNextWinner: ({ commit, state }) => {
    getEarliestCommissionedAPI(function (response) {
      let nextWinner;
      if (response.empty) {
        nextWinner = null;
      } else {
        nextWinner = {
          ...response.docs[0].data(),
          id: response.docs[0].id,
        };
      }
      commit("setNextWinner", nextWinner);
      if (nextWinner) {
        if (nextWinner.rewardAmt <= state.bank) {
          commit("setHasWinner", true);
        } else {
          commit("setHasWinner", false);
        }
      } else {
        commit("setHasWinner", false);
      }
    }, state.loggedInUser.businessId);
  },

  getBank: ({ commit, dispatch, state }) => {
    getBankAPI(function (response) {
      const business = response.data();
      commit("setBank", business.bank);
      dispatch("getNextWinner");
    }, state.loggedInUser.businessId);
  },
  setDefaultLangStng: ({ commit }, payload) => {
    commit("setSettings", { item: "lang", val: payload });
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
    const settingId = await setSettingsAPI(
      state.settings,
      state.loggedInUser.businessId
    );
    commit("setSettings", { item: "id", val: settingId });
    commit("setSubmitting", false);

    Notify.create("Setting updated!");
  },
  loadSettings: async ({ commit, state }) => {
    const settings = await loadSettingsAPI(state.loggedInUser.businessId);
    commit("setSettings", { item: "init", val: settings });
  },
  async search({ commit, state }, payload) {
    commit("setSearch", payload.searchTerm);
    if (payload.searchItem === "user") {
      if (payload.searchTerm) {
        const foundUsers = await searchUsersAPI(
          payload.searchTerm,
          state.loggedInUser.businessId
        );
        commit("clearFoundUsers");
        commit("setFoundUsers", foundUsers);
      } else {
        //Search term is empty
        commit("clearFoundUsers");
        // payload.router.go();
      }
    } else if (payload.searchItem === "transaction") {
      if (payload.searchTerm) {
        const foundTransactions = await searchTransactionsAPI(
          payload.searchTerm,
          state.loggedInUser.businessId
        );
        commit("clearFoundTransactions");
        commit("setFoundTransactions", foundTransactions);
      } else {
        //Search term is empty
        commit("clearTransactions");
        // payload.router.go();
      }
    }
  },
  async editUser({ state }, user) {
    await editUserAPI(user, state.loggedInUser.businessId);
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
  //
  async getTransactionsByStatus({ commit, state }, done, status) {
    const transactions = await getTransactionsByStatusAPI(
      status,
      state.lastDocFieldSearchTrans,
      state.lastDocValSearchTrans,
      state.loggedInUser.businessId
    );
    if (transactions.length > 0) {
      //Check if same request is fired more than once
      if (
        state.lastDocValSearchTrans !==
        transactions[transactions.length - 1][state.lastDocFieldSearchTrans]
      ) {
        commit(
          "setLastDocValSearchTrans",
          transactions[transactions.length - 1][state.lastDocFieldSearchTrans]
        );
        commit("setAllTransactions", transactions);
        done();
      }
    }
  },
  async getAllTransactions({ commit, state }, done) {
    const transactions = await getAllTransactionsAPI(
      state.lastDocFieldTrans,
      state.lastDocValTrans,
      state.loggedInUser.businessId
    );
    if (transactions.length > 0) {
      //Check if same request is fired more than once

      if (
        state.lastDocValTrans !==
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
    const users = await getAllUsersAPI(
      state.lastDocField,
      state.lastDocVal,
      state.loggedInUser.businessId
    );
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
        payload.uid = response.user.uid;
        //Create user profile details
        //Get businessId from current logged in user
        try {
          payload.businessId = state.loggedInUser.businessId;
        } catch (e) {
          console.error(e);
        }

        addUserAPI(payload, state.loggedInUser.businessId).then(
          (response) => {
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
      const transactionId = await addTransactionAPI(
        payload,
        state.loggedInUser.businessId
      );
      commit("setSubmitting", false);
      if (transactionId) {
        Notify.create("Successfully Registered!");
        return transactionId;
      }
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
        //onAuthStateChanged will be called automatically
      })
      .catch((error) => {
        showErrorMessage(error.message);
      });
  },
  logoutUser({ dispatch }) {
    auth.signOut();
  },
  handleAuthStateChange({ commit, dispatch, state }) {
    auth.onAuthStateChanged(async (user) => {
      Loading.hide();
      if (user) {
        // user logged in
        //If profile isn't in local storage save it
        if (LocalStorage.getItem("loggedInUser") === "null") {
          getUserAPI(user).then(
            (response) => {
              //Set loggedInUser in LocalStorage
              const profile = {
                fullName: response.fullName,
                businessId: response.businessId,
                userType: response.userType,
                status: response.status,
              };
              //the above api call returns
              LocalStorage.set("loggedInUser", profile);
              LocalStorage.set("loggedIn", true);
              commit("setLoggedIn", true);
              commit("setLoggedInUser", profile);
              this.$router.push("/transactions").catch(() => {});
            },
            (error) => {
              showErrorMessage(error.message);
            }
          );
        } else {
          //Page refreshed

          if (LocalStorage.getItem("loggedInUser") === "null") {
            getUserAPI(response.user).then(
              (response) => {
                //Set loggedInUser in LocalStorage
                const profile = {
                  fullName: response.fullName,
                  businessId: response.businessId,
                  userType: response.userType,
                  status: response.status,
                };
                //the above api call returns
                LocalStorage.set("loggedInUser", profile);
                commit("setLoggedInUser", profile);
                this.$router.push("/").catch(() => {});
              },
              (error) => {
                showErrorMessage(error.message);
              }
            );
          } else {
            commit("setLoggedIn", true);
            commit("setLoggedInUser", LocalStorage.getItem("loggedInUser"));
            this.$router.push("/").catch(() => {});
          }
        }
      } else {
        commit("setLoggedIn", false);
        LocalStorage.set("loggedIn", false);
        LocalStorage.set("loggedInUser", null);
        this.$router.replace("/auth");
      }
      return user;
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

import { db, firebase } from "boot/firebase";
import { LocalStorage } from "quasar";
import { showErrorMessage } from "src/functions/function-show-error";
//Get loggedInUser from localStorage
const user = LocalStorage.getItem("loggedInUser");
const LIMIT = 10;
export const redeemAPI = async (qr, user) => {
  try {
    //Get rewarded transaction by this qr
    const businessId = user.businessId;
    const docRef = db.collectionGroup("transactions");
    const docSnaps = await docRef
      .where("businessId", "==", businessId)
      .where("status", "==", "rewarded")
      .where("qr", "==", qr)
      .limit(1)
      .get();

    if (!docSnaps.empty) {
      //If found update status to "redeemed"
      const transId = docSnaps.docs[0].id;
      await db.doc(`businesses/${businessId}/transactions/${transId}`).update({
        status: "redeemed",
      });
      //Add Log
      const logTime = new Date(
        new Date().toLocaleString("en-us", {
          timeZone: "Africa/Addis_Ababa",
        })
      );
      const logDate = new Date(logTime);
      logDate.setHours(0, 0, 0, 0);
      await db
        .collection(`businesses/${businessId}/logs`)
        .doc()
        .set({
          ...docSnaps.docs[0].data(),
          user,
          status: "redeemed",
          logTime: firebase.firestore.Timestamp.fromDate(logTime),
          logDate: firebase.firestore.Timestamp.fromDate(logDate),
        });
      //return transaction
      return { ...docSnaps.docs[0].data(), id: docSnaps.docs[0].id };
    }
    return null;
  } catch (e) {
    console.error("Error redeeming transaction: ", e);
    showErrorMessage("Error redeeming transaction");
  }
};

export const getEarliestCommissionedAPI = (callback, businessId) => {
  return new Promise((resolve, reject) => {
    const docRef = db.collectionGroup("transactions");
    const unsubscribe = docRef
      .where("businessId", "==", businessId)
      .where("status", "==", "commissioned")
      .orderBy("time", "asc")
      .limit(1)
      .onSnapshot({ includeMetadataChanges: true }, callback);
  });
};
export const getBankAPI = (callback, businessId) => {
  return new Promise((resolve, reject) => {
    const unsubscribe = db
      .collection("businesses")
      .doc(businessId)
      .onSnapshot({ includeMetadataChanges: true }, callback);
  });
};
export const rewardWinnerAPI = async (bank, winner, qr, user) => {
  try {
    const businessId = user.businessId;
    await db.runTransaction(async (transaction) => {
      const businessRef = db.doc(`businesses/${businessId}`);
      const logRef = db.collection(`businesses/${businessId}/logs`).doc();
      const winnerRef = db.doc(
        `businesses/${businessId}/transactions/${winner.id}`
      );
      const businessDoc = await transaction.get(businessRef);
      const winnerDoc = await transaction.get(winnerRef);
      if (businessDoc.exists && winnerDoc.exists) {
        const newBalance = parseInt(businessDoc.data().bank - winner.rewardAmt);

        transaction.update(businessRef, { bank: newBalance });
        transaction.update(winnerRef, { status: "rewarded", qr });
        //Add Log
        const logTime = new Date(
          new Date().toLocaleString("en-us", {
            timeZone: "Africa/Addis_Ababa",
          })
        );
        const logDate = new Date(logTime);
        logDate.setHours(0, 0, 0, 0);
        const transWithNoId = Object.assign({}, winner);
        delete transWithNoId.id;
        transaction.set(logRef, {
          ...transWithNoId,
          user,
          status: "rewarded",
          logTime: firebase.firestore.Timestamp.fromDate(logTime),
          logDate: firebase.firestore.Timestamp.fromDate(logDate),
        });
      }
    });
  } catch (e) {
    console.log("Error rewarding winner:", e);
    showErrorMessage("Error rewarding winner");
  }
};

export const getCommissionedTransByQRAPI = async (qr, businessId) => {
  try {
    const docRef = db.collectionGroup("transactions");
    const docSnaps = await docRef
      .where("businessId", "==", businessId)
      .where("status", "==", "commissioned")
      .where("qr", "==", qr)
      .get();

    if (!docSnaps.empty) {
      return { ...docSnaps.docs[0].data(), id: docSnaps.docs[0].id };
    }
    return null;
  } catch (e) {
    console.error("Error getting transCommissioned Transactions: ", e);
    showErrorMessage("Error getting Commissioned Trans");
  }
};

export const addUserAPI = async (user, businessId) => {
  try {
    const docRef = await db
      .collection(`businesses/${businessId}/users`)
      .add(user);
    return docRef.id;
  } catch (e) {
    console.error("Error adding user: ", e);
    showErrorMessage("Error adding user");
  }
};

export const addTransactionAPI = async (transaction, loggedInUser) => {
  const businessId = loggedInUser.businessId;
  try {
    const existingDocRef = await db
      .collectionGroup("transactions")
      .where("businessId", "==", businessId)
      .where("referenceNo", "==", transaction.referenceNo)
      .get();
    if (existingDocRef.empty) {
      const docRef = await db
        .collection(`businesses/${businessId}/transactions`)
        .add({ ...transaction, user: loggedInUser });
      return docRef.id;
    } else {
      throw Error("Reference Id already registered.");
    }
  } catch (e) {
    console.error("Error adding transaction: ", e);
    showErrorMessage("Error adding transaction");
  }
};
export const getTransactionsLogAPI = async (
  businessId,
  { log, user, date }
) => {
  let transactionLogs = [];
  try {
    let docSnaps = null;
    const docRef = db.collectionGroup("logs");

    //Three cases
    //all 3 exist(log, user, date)
    //log and date exist
    //user and date exist

    if (log && user && date) {
      if (typeof date == "string") {
        docSnaps = await docRef
          .where("businessId", "==", businessId)
          .where("status", "==", log)
          .where("user.fullName", "==", user)
          .where(
            "logDate",
            "==",
            firebase.firestore.Timestamp.fromDate(new Date(date))
          )
          .orderBy("logTime", "desc")

          .get();
      } else {
        docSnaps = await docRef
          .where("businessId", "==", businessId)
          .where("status", "==", log)
          .where("user.fullName", "==", user)
          .where(
            "logDate",
            "<=",
            firebase.firestore.Timestamp.fromDate(new Date(date.to))
          )
          .where(
            "logDate",
            ">=",
            firebase.firestore.Timestamp.fromDate(new Date(date.from))
          )
          .orderBy("logDate", "desc")
          .orderBy("logTime", "desc")
          .get();
      }
    } else if (log && date) {
      if (typeof date == "string") {
        docSnaps = await docRef
          .where("businessId", "==", businessId)
          .where("status", "==", log)
          .where(
            "logDate",
            "==",
            firebase.firestore.Timestamp.fromDate(new Date(date))
          )
          .orderBy("logTime", "desc")

          .get();
      } else {
        docSnaps = await docRef
          .where("businessId", "==", businessId)
          .where("status", "==", log)
          .where(
            "logDate",
            "<=",
            firebase.firestore.Timestamp.fromDate(new Date(date.to))
          )
          .where(
            "logDate",
            ">=",
            firebase.firestore.Timestamp.fromDate(new Date(date.from))
          )
          .orderBy("logDate", "desc")
          .orderBy("logTime", "desc")
          .get();
      }
    } else if (user && date) {
      if (typeof date == "string") {
        docSnaps = await docRef
          .where("businessId", "==", businessId)
          .where("user.fullName", "==", user)
          .where(
            "logDate",
            "==",
            firebase.firestore.Timestamp.fromDate(new Date(date))
          )
          .orderBy("logTime", "desc")
          .get();
      } else {
        docSnaps = await docRef
          .where("businessId", "==", businessId)
          .where("user.fullName", "==", user)
          .where(
            "logDate",
            "<=",
            firebase.firestore.Timestamp.fromDate(new Date(date.to))
          )
          .where(
            "logDate",
            ">=",
            firebase.firestore.Timestamp.fromDate(new Date(date.from))
          )
          .orderBy("logDate", "desc")
          .orderBy("logTime", "desc")
          .get();
      }
    } else if (date) {
      if (typeof date == "string") {
        docSnaps = await docRef
          .where("businessId", "==", businessId)
          .where(
            "logDate",
            "==",
            firebase.firestore.Timestamp.fromDate(new Date(date))
          )
          .orderBy("logTime", "desc")

          .get();
      } else {
        docSnaps = await docRef
          .where("businessId", "==", businessId)
          .where(
            "logDate",
            "<=",
            firebase.firestore.Timestamp.fromDate(new Date(date.to))
          )
          .where(
            "logDate",
            ">=",
            firebase.firestore.Timestamp.fromDate(new Date(date.from))
          )
          .orderBy("logDate", "desc")
          .orderBy("logTime", "desc")
          .get();
      }
    }

    // .where("status", "==", statusTerm)
    // .orderBy(lastDocField, "asc")
    // .startAfter(lastDocVal)
    // docSnaps = await docRef.limit(LIMIT).get();

    docSnaps.forEach((doc) => {
      transactionLogs.push({ ...doc.data(), id: doc.id });
    });
  } catch (e) {
    console.error("Error getting transaction logs: ", e);
    showErrorMessage("Error getting transaction logs");
  }
  return transactionLogs;
};

export const getAllTransactionsAPI = async (
  lastDocField,
  lastDocVal,
  businessId
) => {
  let transactions = [];
  try {
    const docRef = db.collectionGroup("transactions");
    const docSnaps = await docRef
      .where("businessId", "==", businessId)
      .orderBy(lastDocField, "desc")
      .startAfter(lastDocVal)
      .limit(LIMIT)
      .get();

    docSnaps.forEach((doc) => {
      transactions.push({ ...doc.data(), id: doc.id });
    });
  } catch (e) {
    console.error("Error getting transactions: ", e);
    showErrorMessage("Error getting transactions");
  }
  return transactions;
};

export const getAllUsersAPI = async (lastDocField, lastDocVal, businessId) => {
  let users = [];
  try {
    const docRef = db.collectionGroup("users");
    const docSnaps = await docRef
      .where("businessId", "==", businessId)
      .orderBy(lastDocField, "asc")
      .startAfter(lastDocVal)
      .limit(LIMIT)
      .get();

    docSnaps.forEach((doc) => {
      users.push({ ...doc.data(), id: doc.id });
    });
  } catch (e) {
    console.error("Error getting users: ", e);
    showErrorMessage("Error getting users");
  }
  return users;
};

export const getUserAPI = async (user) => {
  try {
    const docSnaps = await db
      .collectionGroup("users")
      .where("uid", "==", user.uid)
      .get();

    if (docSnaps.empty) {
      throw Error("User doesn't exist.");
    } else {
      return docSnaps.docs[0].data();
    }
    // return { ...docSnaps.data(), id: docSnaps.id };
  } catch (e) {
    console.error("Error getting user: ", e);
    showErrorMessage("Error getting user");
  }
};

export const editUserAPI = async (user, businessId) => {
  try {
    const docRef = db.doc(`businesses/${businessId}/users/${user.id}`);
    const res = await docRef.update(user);
  } catch (e) {
    console.error("Error updating user: ", e);
    showErrorMessage("Error updating user");
  }
};

export const editTransactionAPI = async (transaction) => {
  try {
    const docRef = db.doc(
      `businesses/${transaction.businessId}/transactions/${transaction.id}`
    );
    const res = await docRef.update(transaction);
  } catch (e) {
    console.error("Error updating transaction: ", e);
    showErrorMessage("Error updating transaction");
  }
};

export const searchUsersAPI = async (searchTerm, businessId) => {
  try {
    const userRef = db.collection(`businesses/${businessId}/users`);
    const fullName = userRef.where("fullName", "==", searchTerm).get();
    const email = userRef.where("email", "==", searchTerm).get();
    const phoneNo = userRef.where("phoneNo", "==", searchTerm).get();
    const [fullNameSnapshot, emailSnapshot, phoneNoSnapshot] =
      await Promise.all([fullName, email, phoneNo]);

    const fullNameArray = fullNameSnapshot.docs.map((item) => item.data());
    const emailArray = emailSnapshot.docs.map((item) => item.data());
    const phoneNoArray = phoneNoSnapshot.docs.map((item) => item.data());

    const usersArray = fullNameArray.concat(emailArray, phoneNoArray);
    return usersArray;
  } catch (e) {
    console.error("Error searching users: ", e);
    showErrorMessage("Error searching users");
  }
};

export const searchTransactionsAPI = async (searchTerm, businessId) => {
  try {
    const transactionRef = db.collection(
      `businesses/${businessId}/transactions`
    );
    const referenceNo = transactionRef
      .where("referenceNo", "==", searchTerm)
      .get();
    //Status is sorted not searched because it returns a lot of records
    // const status = transactionRef.where("status", "==", searchTerm).get();
    const phoneNo = transactionRef.where("phoneNo", "==", searchTerm).get();
    const [referenceNoSnapshot, phoneNoSnapshot, statusSnapshot] =
      await Promise.all([referenceNo, phoneNo]);

    const referenceNoArray = referenceNoSnapshot.docs.map((item) =>
      item.data()
    );

    const phoneNoArray = phoneNoSnapshot.docs.map((item) => item.data());

    const transactionsArray = referenceNoArray.concat(phoneNoArray);
    return transactionsArray;
  } catch (e) {
    console.error("Error searching transactions: ", e);
    showErrorMessage("Error searching transactions");
  }
};

export const setSettingsAPI = async (settings, businessId) => {
  try {
    const settingsClone = Object.assign({}, settings);
    delete settingsClone.id;
    //If setting id is provided
    //Make sure setting exists
    //then update setting
    if (settings.id) {
      const docRef = db.doc(`businesses/${businessId}/settings/${settings.id}`);
      await db.runTransaction(async (transaction) => {
        const settingsDoc = await transaction.get(docRef);
        if (!settingsDoc.exists) {
          //New Setting
          transaction.set(docRef, settingsClone);
        } else {
          transaction.update(docRef, settingsClone);
        }
      });
      return docRef.id;
    } else {
      //If setting id is not provided
      //create new setting entry
      settingsClone["businessId"] = businessId;

      const docRef = db.collection(`businesses/${businessId}/settings`).doc();
      await db.runTransaction(async (transaction) => {
        transaction.set(docRef, settingsClone);
      });
      return docRef.id;
    }
  } catch (e) {
    console.error("Error setting settings: ", e);
    showErrorMessage("Error setting settings");
  }
};

export const loadSettingsAPI = async (businessId) => {
  try {
    const docSnaps = await db
      .collectionGroup("settings")
      .where("businessId", "==", businessId)
      .get();
    if (!docSnaps.empty) {
      return { ...docSnaps.docs[0].data(), id: docSnaps.docs[0].id };
    } else {
      return null;
    }
  } catch (e) {
    console.error("Error loading settings: ", e);
    showErrorMessage("Error loading settings");
  }
};

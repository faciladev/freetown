import { db, firebase } from "boot/firebase";
import { LocalStorage } from "quasar";
import { showErrorMessage } from "src/functions/function-show-error";
//Get loggedInUser from localStorage
const user = LocalStorage.getItem("loggedInUser");
const LIMIT = 10;

let unsubscribe;

export const getBankAPI = (callback) => {
  return new Promise((resolve, reject) => {
    unsubscribe = db
      .collection("businesses")
      .doc(user.businessId)
      .onSnapshot({ includeMetadataChanges: true }, callback);
  });
};

export const addUserAPI = async (user) => {
  console.log("Add user api called.");
  try {
    const docRef = await db
      .collection(`businesses/${user.businessId}/users`)
      .add(user);
    return docRef.id;
  } catch (e) {
    console.error("Error adding user: ", e);
    showErrorMessage("Error adding user");
  }
};

export const addTransactionAPI = async (transaction) => {
  try {
    const docRef = await db
      .collection(`businesses/${user.businessId}/transactions`)
      .add(transaction);
    return docRef.id;
  } catch (e) {
    console.error("Error adding transaction: ", e);
    showErrorMessage("Error adding transaction");
  }
};

export const getAllTransactionsAPI = async (lastDocField, lastDocVal) => {
  let transactions = [];
  try {
    const docRef = db.collectionGroup("transactions");
    const docSnaps = await docRef
      .where("businessId", "==", user.businessId)
      .orderBy(lastDocField, "asc")
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

export const getAllUsersAPI = async (lastDocField, lastDocVal) => {
  let users = [];
  try {
    const docRef = db.collectionGroup("users");
    const docSnaps = await docRef
      .where("businessId", "==", user.businessId)
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

export const editUserAPI = async (user) => {
  console.log("editUserAPI:user", user.id);
  try {
    const docRef = db.doc(`businesses/${user.businessId}/users/${user.id}`);
    const res = await docRef.update(user);
    // const docSnaps = await docRef.get();
    console.log(res);
    // return { ...docSnaps.data(), id: docSnaps.id };
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
    // const docSnaps = await docRef.get();
    console.log(res);
    // return { ...docSnaps.data(), id: docSnaps.id };
  } catch (e) {
    console.error("Error updating transaction: ", e);
    showErrorMessage("Error updating transaction");
  }
};

export const searchUsersAPI = async (searchTerm) => {
  try {
    const userRef = db.collectionGroup("users");
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

export const searchTransactionsAPI = async (searchTerm) => {
  try {
    const transactionRef = db.collectionGroup("transactions");
    const referenceNo = transactionRef
      .where("referenceNo", "==", searchTerm)
      .get();
    // const email = transactionRef.where("email", "==", searchTerm).get();
    const phoneNo = transactionRef.where("phoneNo", "==", searchTerm).get();
    const [referenceNoSnapshot, phoneNoSnapshot] = await Promise.all([
      referenceNo,
      phoneNo,
    ]);

    const referenceNoArray = referenceNoSnapshot.docs.map((item) =>
      item.data()
    );
    // const emailArray = emailSnapshot.docs.map((item) => item.data());
    const phoneNoArray = phoneNoSnapshot.docs.map((item) => item.data());

    const transactionsArray = referenceNoArray.concat(phoneNoArray);
    return transactionsArray;
  } catch (e) {
    console.error("Error searching transactions: ", e);
    showErrorMessage("Error searching transactions");
  }
};

export const setSettingsAPI = async (settings) => {
  try {
    const settingsClone = Object.assign({}, settings);
    delete settingsClone.id;
    //If setting id is provided
    //Make sure setting exists
    //then update setting
    if (settings.id) {
      const docRef = db.doc(
        `businesses/${user.businessId}/settings/${settings.id}`
      );
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
      console.log("New Settings");
      //If setting id is not provided
      //create new setting entry
      settingsClone["businessId"] = user.businessId;

      const docRef = db
        .collection(`businesses/${user.businessId}/settings`)
        .doc();
      await db.runTransaction(async (transaction) => {
        transaction.set(docRef, settingsClone);
        console.log("docRef", docRef);
      });
      return docRef.id;
    }
  } catch (e) {
    console.error("Error setting settings: ", e);
    showErrorMessage("Error setting settings");
  }
};

export const loadSettingsAPI = async () => {
  try {
    const docSnaps = await db
      .collectionGroup("settings")
      .where("businessId", "==", user.businessId)
      .get();
    // const docSnaps = await docRef.limit(1).get();
    console.log("Settings", docSnaps.docs[0].data());
    console.log("SettingId", docSnaps.docs[0].id);
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

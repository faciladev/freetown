import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyC3ZZ4H4-HTbThs4AvwVvjGaMKBxKMaup4",
  authDomain: "seven-glory.firebaseapp.com",
  projectId: "seven-glory",
  storageBucket: "seven-glory.appspot.com",
  messagingSenderId: "194450130615",
  appId: "1:194450130615:web:03e9b07bf6498d78d1ef32",
  measurementId: "G-GBX4V5V5TR",
});

const db = firebase.firestore(firebaseApp);
const auth = firebaseApp.auth();

export { db, firebase, auth };

// Import the functions you need from the SDKs you need
// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey:
    "AIzaSyBAuo67iNn7blOWityx8sjS5kNQg1GZWu8" /* Safe to include in client-side code */,
  authDomain: "morakano-dictionary-39928.firebaseapp.com",
  projectId: "morakano-dictionary-39928",
  storageBucket: "morakano-dictionary-39928.appspot.com",
  messagingSenderId: "262607427214",
  appId: "1:262607427214:web:3dd370da54381c8c701bdf",
  measurementId: "G-NVBP9Y3WVW",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(); // https://stackoverflow.com/questions/71356236/firebase-emulator-setup-getfirestore-or-getfirestorefirebaseapp#:~:text=Ultimately%20this%20means%20that%20unless,and%20use%20it%20where%20necessary.
export const auth = getAuth();
export const storage = getStorage();
// export const analytics = getAnalytics(app);'

// User store
import { writable } from "svelte/store";
export const currentUser = writable<any>(null);

onAuthStateChanged(auth, (user) => {
  currentUser.set(user);
});

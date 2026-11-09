// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCoLRWUG0ZqLoYQ_NU6hVfiV-03dAwVImQ",
  authDomain: "tower-defense-idle-9b45a.firebaseapp.com",
  projectId: "tower-defense-idle-9b45a",
  storageBucket: "tower-defense-idle-9b45a.firebasestorage.app",
  messagingSenderId: "156538797596",
  appId: "1:156538797596:web:490ade7f1911b12fd4e9d9",
  measurementId: "G-2J6QE6EX8N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
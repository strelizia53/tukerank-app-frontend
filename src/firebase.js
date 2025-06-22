// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCUfW2adLLAlLcHpE2ZfAyf9vpShiZsG0g",
  authDomain: "tukerank-app.firebaseapp.com",
  projectId: "tukerank-app",
  storageBucket: "tukerank-app.firebasestorage.app",
  messagingSenderId: "435143924097",
  appId: "1:435143924097:web:439b1983f0906fa30ef080",
  measurementId: "G-YRQLCCX1ML",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, analytics, db, auth, storage };

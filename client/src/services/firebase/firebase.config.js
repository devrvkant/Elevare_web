// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDsp22V71AMdJAf6pjTrQagf_sDo1sv8nI",
  authDomain: "elevare-1881d.firebaseapp.com",
  projectId: "elevare-1881d",
  storageBucket: "elevare-1881d.firebasestorage.app",
  messagingSenderId: "116917254196",
  appId: "1:116917254196:web:076a4c31e2aefb68e5b261",
  measurementId: "G-PLEXVF3GF4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };

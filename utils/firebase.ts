// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBV5YUcLyt6Fv34yCPQrAwVC0T4fnyX7g8",
    authDomain: "affiliate-c4308.firebaseapp.com",
    projectId: "affiliate-c4308",
    storageBucket: "affiliate-c4308.appspot.com",
    messagingSenderId: "38267591746",
    appId: "1:38267591746:web:e5e9650862f9fa184c61db",
    measurementId: "G-YTPBE88P8P"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app)
// const analytics = getAnalytics(app);
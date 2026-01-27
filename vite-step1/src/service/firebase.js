// src/service/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDjml_T1gPoQHlXKj-rDre9ainPNjiTi0w",
    authDomain: "kosmocalendarproject26.firebaseapp.com",
    projectId: "kosmocalendarproject26",
    storageBucket: "kosmocalendarproject26.firebasestorage.app",
    messagingSenderId: "3677297777",
    appId: "1:3677297777:web:1ff6703831452d72c50fd0",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

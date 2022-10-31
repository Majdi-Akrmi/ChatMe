import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDi6x6x8zcSiTTTD14C-pCqFutNQY5l7Mw",
  authDomain: "chatme-85314.firebaseapp.com",
  projectId: "chatme-85314",
  storageBucket: "chatme-85314.appspot.com",
  messagingSenderId: "546416533047",
  appId: "1:546416533047:web:f89eaaf483d4be541fe9b2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
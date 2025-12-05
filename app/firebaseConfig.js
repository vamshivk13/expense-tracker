// src/firebaseClient.js
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  push,
  set,
  onValue,
  update,
  remove,
} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDhDYnkmPpsWn51RIBQgTPL7ISTGYjzvvw",
  authDomain: "expense-tracker-db610.firebaseapp.com",
  databaseURL: "https://expense-tracker-db610-default-rtdb.firebaseio.com",
  projectId: "expense-tracker-db610",
  storageBucket: "expense-tracker-db610.firebasestorage.app",
  messagingSenderId: "119642602949",
  appId: "1:119642602949:web:48245ddfe7bd739d9c5fac",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, push, set, onValue, update, remove };

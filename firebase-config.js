// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDIgFyJLUG7Iju45CxKshIlzO-1gB4Eeow",
  authDomain: "kamzy-wardrobe.firebaseapp.com",
  projectId: "kamzy-wardrobe",
  storageBucket: "kamzy-wardrobe.firebaseapp.com",
  messagingSenderId: "846636201302",
  appId: "1:846636201302:web:22ff79b95fba5ff97d12f7",
  measurementId: "G-8KMK8WTXPQ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);



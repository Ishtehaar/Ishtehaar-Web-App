// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "ishtehaar-475fc.firebaseapp.com",
  projectId: "ishtehaar-475fc",
  storageBucket: "ishtehaar-475fc.appspot.com",
  messagingSenderId: "274731536562",
  appId: "1:274731536562:web:901df3979b5717f570b9ab"
};

// Initialize Firebasex
export const app = initializeApp(firebaseConfig);


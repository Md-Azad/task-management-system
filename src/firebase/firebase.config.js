// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.meta.VITE_apiKey,
  authDomain: process.env.meta.VITE_authDomain,
  projectId: process.env.meta.VITE_projectId,
  storageBucket: process.env.meta.VITE_storageBucket,
  messagingSenderId: process.env.meta.VITE_messagingSenderId,
  appId: process.env.meta.VITE_appId,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

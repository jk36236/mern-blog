// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-d9c36.firebaseapp.com",
  projectId: "mern-blog-d9c36",
  storageBucket: "mern-blog-d9c36.firebasestorage.app",
  messagingSenderId: "285196386291",
  appId: "1:285196386291:web:beeb560a218bc0a8395c86"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

//this firebase code will initialize a firebase app and this app is initialized based on this firebase config
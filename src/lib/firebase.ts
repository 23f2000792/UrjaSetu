// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "studio-6965475964-c86b7",
  "appId": "1:236000130841:web:31448de373b2eebe127788",
  "apiKey": "AIzaSyAW9gEQweqSg3fY3GdS_pReH-e3iqfaETA",
  "authDomain": "studio-6965475964-c86b7.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "236000130841"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

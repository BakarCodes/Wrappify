// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCqo1hjlydOfxapiBLhtvQ50R5JU3ZMOx8",
    authDomain: "wrappify-35cb2.firebaseapp.com",
    databaseURL: "https://wrappify-35cb2-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "wrappify-35cb2",
    storageBucket: "wrappify-35cb2.appspot.com",
    messagingSenderId: "64487685334",
    appId: "1:64487685334:web:a8c86a45648f4bd4a69d77",
    measurementId: "G-QW8K1FYM35"
  };

export default firebaseConfig;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
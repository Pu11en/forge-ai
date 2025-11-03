import * as firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/functions';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDL05OxCJI55B4p1cqEkVPrX97qBatEB_o",
    authDomain: "arche-forge.firebaseapp.com",
    projectId: "arche-forge",
    storageBucket: "arche-forge.firebasestorage.app",
    messagingSenderId: "728719470809",
    appId: "1:728719470809:web:65db6d16a66cdde6bf8ec8",
    measurementId: "G-4W90MC3T6R"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();
const functions = firebase.functions();

// For local testing of functions, you might use the emulator
// Make sure to only do this in a development environment check
// if (window.location.hostname === "localhost") {
//   functions.useEmulator("localhost", 5001);
// }

export { auth, db, functions };
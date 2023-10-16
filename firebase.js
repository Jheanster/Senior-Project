// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZXwPRDv4raVbgUv961EVkm2nlM7u5oVg",
  authDomain: "spotme-6f4c3.firebaseapp.com",
  projectId: "spotme-6f4c3",
  storageBucket: "spotme-6f4c3.appspot.com",
  messagingSenderId: "350946761663",
  appId: "1:350946761663:web:cc906c85e51ce3106b5f0a"
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0){
    firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app
}

const auth = firebase.auth(app)
const docDB = firebase.firestore(app)
const fileDB = firebase.storage(app)

export { auth, docDB, fileDB }
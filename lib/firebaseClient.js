import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAI7c1XRCfZp5OaUgeQQJdv53nnq6w8VyU",
  authDomain: "yoga-template-c2fcd.firebaseapp.com",
  projectId: "yoga-template-c2fcd",
  storageBucket: "yoga-template-c2fcd.firebasestorage.app",
  messagingSenderId: "333867919857",
  appId: "1:333867919857:web:9e84da36cc4d950dbbfc50",
  measurementId: "G-P9LTF7B14G",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, app, db };

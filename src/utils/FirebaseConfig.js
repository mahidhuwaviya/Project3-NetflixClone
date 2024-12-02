import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCMK7OIlHEnqA_81hNaZeP1xSIOh7zZOEg",
  authDomain: "react-netflix-clone-3fe96.firebaseapp.com",
  projectId: "react-netflix-clone-3fe96",
  storageBucket: "react-netflix-clone-3fe96.appspot.com",
  messagingSenderId: "602132784744",
  appId: "1:602132784744:web:936c769588bb3af6283ddd",
  measurementId: "G-K7K0HXP3NY",
};

const app = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(app);

export { firebaseAuth };

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
    apiKey: "AIzaSyAzdONECuUHDGkJ7v92Hc1z8oGOC6E30eY",
    authDomain: "todo-517ce.firebaseapp.com",
    projectId: "todo-517ce",
    storageBucket: "todo-517ce.firebasestorage.app",
    messagingSenderId: "965425610736",
    appId: "1:965425610736:web:124e8462addbbe90902735",
    measurementId: "G-9MDBSJVN2W",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

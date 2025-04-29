//For Admin Inventory

import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    sendEmailVerification,
    validatePassword,
    signOut
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {
    getFirestore,
    doc,
    setDoc,
    collection,
    addDoc,
    deleteDoc,
    updateDoc,
    getDocs,
    getDoc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { firebaseConfig } from "../firebase-config.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
const appCredential = initializeApp(firebaseConfig);
// const analytics = getAnalytics(appCredential);

export {
    appCredential,
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    sendEmailVerification,
    validatePassword,
    signOut,
    getFirestore,
    doc,
    setDoc,
    addDoc,
    deleteDoc,
    updateDoc,
    getDocs,
    getDoc,
    collection
};
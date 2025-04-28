// Import the functions you need from the SDKs you need
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
  getDoc,
  query,
  where
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";

// Import your firebaseConfig from a separate file
import { firebaseConfig } from "/admin/firebase-config.js";

// Initialize Firebase
const appCredential = initializeApp(firebaseConfig);
// const analytics = getAnalytics(appCredential);
const auth = getAuth(appCredential);


export {
  appCredential,
  getAuth,
  auth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  validatePassword,
  signOut,
  getFirestore,
  query,
  where,
  doc,
  setDoc,
  addDoc,
  deleteDoc,
  updateDoc,
  getDocs,
  getDoc,
  collection
};
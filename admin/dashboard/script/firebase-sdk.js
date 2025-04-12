  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBtfrDYSCxLwRTf8SbccI0taOpP1PZt4ok",
    authDomain: "chandria-s-la-robe.firebaseapp.com",
    projectId: "chandria-s-la-robe",
    storageBucket: "chandria-s-la-robe.firebasestorage.app",
    messagingSenderId: "34498186673",
    appId: "1:34498186673:web:b3a290af4e00e8e07cc190",
    measurementId: "G-XE9V7HM844"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  
  export { app };
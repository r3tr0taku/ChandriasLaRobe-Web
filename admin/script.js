import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { app } from "./firebase-sdk.js";

$(document).ready(function () {
    const auth = getAuth(app);

    // BOOTSTRAP TOAST
    const toastElement = $("#loginToast");
    const loginToast = new bootstrap.Toast(toastElement[0]); // make sure to pass the DOM element, not jQuery object

    // FLAG TO PREVENT IMMEDIATE REDIRECT AFTER LOGIN
    let isLoggingIn = false;

    // Check if user is already signed in, if so, redirect to profile page
    onAuthStateChanged(auth, user => {
        if (user && !isLoggingIn) {
            // Delay just a bit to allow UI elements to load before redirecting
            setTimeout(() => {
                window.location.href = "/admin/dashboard/dashboard.html"; // Redirect to profile page if already logged in
            }, 100);
        }
    });

    // VARIABLES
    const $email = $("#input-email");
    const $password = $("#input-password");
    const loginBtn = $("#login-btn");

    // LOGIN BUTTON FUNCTION
    loginBtn.on("click", async function (e) {
        e.preventDefault();

        // Get email and password
        const email = $email.val();
        const password = $password.val();

        // Disable the login button while attempting login
        loginBtn.addClass("disabled").text("Logging In...");

        // Set logging in flag to true so we don’t auto-redirect before toast
        isLoggingIn = true;

        try {
            // Sign in with Firebase Authentication
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            // Show toast
            loginToast.show();

            // Delay redirect to allow toast to show
            setTimeout(() => {
                window.location.href = "./dashboard/dashboard.html";
            }, 1100);

        } catch (error) {
            const errorMessage = error.message;

            console.log("Unable to Login: " + error.code + error.message);

            // Show error message
            alert("Error: " + errorMessage);
        }

        // Re-enable the login button after login attempt
        loginBtn.removeClass("disabled").text("Login");
    });
});
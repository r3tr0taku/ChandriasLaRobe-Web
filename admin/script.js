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
    const loginToast = new bootstrap.Toast(toastElement[0]);

    // FLAG TO PREVENT IMMEDIATE REDIRECT AFTER LOGIN
    let isLoggingIn = false;

    // Check if user is already signed in, if so, redirect to profile page
    onAuthStateChanged(auth, user => {
        if (user && !isLoggingIn) {
            setTimeout(() => {
                window.location.href = "/admin/dashboard/dashboard.html";
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
        loginBtn.addClass("disabled").text("PROCEEDING...");

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
        loginBtn.removeClass("disabled").text("PROCEED");
    });

    // Password toggle functionality (fix: only run once DOM is ready)
    const passwordInput = document.getElementById('input-password');
    const togglePassword = document.getElementById('togglePassword');
    if (passwordInput && togglePassword) {
        togglePassword.addEventListener('click', function () {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('bx-show');
            this.classList.toggle('bx-hide');
        });
    }
});
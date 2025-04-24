import {
    appCredential,
    auth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    getFirestore,
    collection,
    getDocs
} from "/admin/chandrias-sdk.js";

$(document).ready(function () {
    const notyf = new Notyf({
        position: {
            x: "center",
            y: "top"
        }
    });

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
    const $togglePassword = $("#togglePassword");
    const loginBtn = $("#login-btn");

    const formatErrorMessage = errorCode => {
        let message = "";

        if (
            errorCode === "auth/invalid-email" ||
            errorCode === "auth/missing-email"
        ) {
            message = "Please enter a valid email";
        } else if (
            errorCode === "auth/missing-password" ||
            errorCode === "auth/weak-password"
        ) {
            message = "Password must be at least 6 characters long";
        } else if (errorCode === "auth/email-already-in-use") {
            message = "Email is already taken";
        } else if (errorCode === "auth/user-not-found") {
            message = "No user found with this email";
        } else if (errorCode === "auth/wrong-password") {
            message = "Incorrect password";
        } else if (errorCode === "auth/invalid-credential") {
            message = "Incorrect Email or Password";
        }

        return message;
    };

    // LOGIN BUTTON FUNCTION
    loginBtn.on("click", async function (e) {
        e.preventDefault();

        // Get email and password
        const email = $email.val();
        const password = $password.val();

        // Disable the login button while attempting login
        loginBtn.attr("disabled", true).text("PROCEEDING...");

        // Set logging in flag to true so we don’t auto-redirect before toast
        isLoggingIn = true;

        try {
            // Sign in with Firebase Authentication
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            
            // CHECKING IF VERIFIED
            const user = userCredential.user;
            if (!user.emailVerified) {
                // Sign out the unverified user
                await auth.signOut();

                notyf.open({
                    type: "error",
                    message: "Please verify your email before logging in.",
                    duration: 5000
                });

                loginBtn.attr("disabled", false).text("PROCEED");
                return;
            }

            // SHOW NOTYF
            notyf.open({
                type: "success",
                message: "Successful Login, Redirecting...",
                duration: 3000
            });

            // Delay redirect to allow toast to show
            setTimeout(() => {
                window.location.href = "/admin/dashboard/dashboard.html";
            }, 1100);
        } catch (error) {
            console.error("Unable to Login: " + error.code + error.message);
            // Format user-friendly error message
            const errorMsg = formatErrorMessage(error.code);

            // If formatErrorMessage returns a message, show it
            if (errorMsg) {
                notyf.open({
                    type: "error",
                    message: errorMsg,
                    duration: 5000
                });
            } else {
                // Fallback for unknown errors
                notyf.error("Login failed. Please try again.");
            }
        }

        // Re-enable the login button after login attempt
        loginBtn.attr("disabled", false).text("PROCEED");
    });

    // CHECKING EMAIL
    const chandriaDB = getFirestore(appCredential);
    async function emailExistsInFirestore(email) {
        const usersRef = collection(chandriaDB, "users");
        const snapshot = await getDocs(usersRef);
        const exists = snapshot.docs.some(doc => doc.data().email === email);
        return exists;
    }

    // FORGOT BUTTON FUNCTION
    const forgotBtn = $("#submit-forgot-btn");
    forgotBtn.on("click", async function (e) {
        e.preventDefault();
        const email = $("#input-forgot-email").val().trim();

        if (email === "") {
            notyf.error("Please enter your email address.");
            return;
        }

        // Validate format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            notyf.error("Invalid email format.");
            return;
        }

        forgotBtn.attr("disabled", true).text("Submitting...");

        try {
            //
            const exists = await emailExistsInFirestore(email);
            if (!exists) {
                notyf.error("Email not found. Please try another.");
                forgotBtn.attr("disabled", false).text("SUBMIT");
                return;
            }
            //
            await sendPasswordResetEmail(auth, email);
            notyf.open({
                type: "success",
                message: "Reset link sent! Check your inbox.",
                duration: 5000
            });
            forgotBtn.attr("disabled", false).text("SUBMIT");
        } catch (error) {
            console.error("Reset Error:", error.code, error.message);
            notyf.open({
                type: "error",
                message: "Something went wrong. Please try again.",
                duration: 5000
            });
            forgotBtn.attr("disabled", false).text("SUBMIT");
        }
    });

    // TOGGLE BETWEEN FORGOT PASSWORD
    $("#forgot-password").on("click", function () {
        $(".login-container").addClass("hide");
        $(".forgot-container").addClass("show");
    });
    $("#back-to-login").on("click", function () {
        $(".forgot-container").removeClass("show");
        $(".login-container").removeClass("hide");
    });

    // Password toggle functionality (fix: only run once DOM is ready)
    $togglePassword.on("click", function () {
        const type =
            $password.attr("type") === "password" ? "text" : "password";
        $password.attr("type", type);
        $(this).toggleClass("bx-show bx-hide");
    });
});

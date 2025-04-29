import {
    auth,
    onAuthStateChanged,
    signOut
} from "./chandrias-sdk.js";

$(document).ready(function () {

    // Check if the user is logged in and display the email
    onAuthStateChanged(auth, user => {
        if (user) {
            // User is signed in
            const userEmail = user.email;
            $("#user-email").text(userEmail); // Using jQuery to update the email
        } else {
            // If no user is logged in, redirect to login page
            window.location.href = "/chandriahomepage/user_authentication.html";
        }
    });

    // Logout functionality using jQuery
    $("#signOut-btn").on("click", function () {
        if (confirm("Are you sure you want to Log-out?")) {
            signOut(auth)
                .then(() => {
                    window.location.href = "/chandriahomepage/user_authentication.html"; // Redirect to login page after logout
                })
                .catch(error => {
                    console.error("Error signing out:", error);
                });
        }
    });
});

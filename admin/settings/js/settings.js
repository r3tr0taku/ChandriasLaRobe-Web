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
            window.location.href = "/admin/authentication.html";
        }
    });

    // LOGOUT FUNCTION
    $("#signOut-btn").on("click", function () {
        if (confirm("Are you sure you want to Log-out?")) {
            signOut(auth)
                .then(() => {
                    window.location.href = "/admin/authentication.html"; // Redirect to login page after logout
                })
                .catch(error => {
                    console.error("Error signing out:", error);
                });
        }
    });

    // TOGGLE BETWEEN DARK MODE
    $(document).ready(function () {
        const $body = $("body"),
            $sidebar = $body.find(".custom-sidebar"),
            $toggle = $body.find(".custom-toggle"),
            $modeSwitch = $body.find(".custom-toggle-switch"),
            $modeText = $body.find(".custom-mode-text");

        // Sidebar toggle (chevron)
        $toggle.on("click", function () {
            $sidebar.toggleClass("close");
        });

        // Mode toggle
        $modeSwitch.on("click", function () {
            $body.toggleClass("dark");
            $modeText.text($body.hasClass("dark") ? "Light Mode" : "Dark Mode");
        });
    });
});

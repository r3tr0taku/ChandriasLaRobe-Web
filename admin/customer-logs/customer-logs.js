document.addEventListener("DOMContentLoaded", () => {
    const body = document.querySelector("body"),
        sidebar = body.querySelector(".sidebar"),
        toggle = body.querySelector(".toggle"),
        searchBox = body.querySelector(".search-box"),
        modeSwitch = body.querySelector(".toggle-switch"),
        modeText = body.querySelector(".mode-text");

    const logoutBtn = body.querySelector(".bxs-log-out").closest("a");
    const popup = document.getElementById("confirmation-popup");
    const confirmLogout = document.getElementById("confirm-logout");
    const cancelLogout = document.getElementById("cancel-logout");

    // Sidebar toggle (chevron)
    toggle.addEventListener("click", () => {
        sidebar.classList.toggle("close");
    });

    // Search expands sidebar
    searchBox.addEventListener("click", () => {
        sidebar.classList.remove("close");
    });

    // Mode toggle
    modeSwitch.addEventListener("click", () => {
        body.classList.toggle("dark");
        modeText.innerText = body.classList.contains("dark") ? "Light Mode" : "Dark Mode";
    });

    // Logout click opens confirmation popup
    logoutBtn.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent the link from navigating
        popup.classList.add("show");
        popup.classList.remove("hidden");
    });

    // Confirm logout
    confirmLogout.addEventListener("click", () => {
        console.log("User logged out");
        popup.classList.remove("show");
        popup.classList.add("hidden");
        window.location.href = "../authentication.html"; // Redirect to authentication page
    });

    // Cancel logout
    cancelLogout.addEventListener("click", () => {
        popup.classList.remove("show");
        popup.classList.add("hidden");
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const body = document.querySelector("body"),
        sidebar = body.querySelector(".custom-sidebar"),
        toggle = body.querySelector(".custom-toggle"),
        searchBox = body.querySelector(".custom-search-box"),
        modeSwitch = body.querySelector(".custom-toggle-switch"),
        modeText = body.querySelector(".custom-mode-text");

    const logoutBtn = body.querySelector(".bxs-log-out").closest("a");
    const popup = document.getElementById("custom-confirmation-popup");
    const confirmLogout = document.getElementById("custom-confirm-logout");
    const cancelLogout = document.getElementById("custom-cancel-logout");

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
        window.location.href = "../authentication.html";
    });

    // Cancel logout
    cancelLogout.addEventListener("click", () => {
        popup.classList.remove("show");
        popup.classList.add("hidden");
    });
});

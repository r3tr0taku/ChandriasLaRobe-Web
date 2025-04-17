document.addEventListener("DOMContentLoaded", () => {
    const body = document.querySelector("body"),
        sidebar = body.querySelector(".sidebar"),
        toggle = body.querySelector(".toggle"),
        modeSwitch = body.querySelector(".toggle-switch"),
        modeText = body.querySelector(".mode-text");

    // Sidebar toggle (chevron)
    toggle.addEventListener("click", () => {
        sidebar.classList.toggle("close");
    });

    // Mode toggle
    modeSwitch.addEventListener("click", () => {
        body.classList.toggle("dark");
        modeText.innerText = body.classList.contains("dark") ? "Light Mode" : "Dark Mode";
    });

});

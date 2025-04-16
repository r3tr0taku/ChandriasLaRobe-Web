document.addEventListener("DOMContentLoaded", () => {
    const body = document.querySelector("body"),
        sidebar = body.querySelector(".custom-sidebar"),
        toggle = body.querySelector(".custom-toggle"),
        modeSwitch = body.querySelector(".custom-toggle-switch"),
        modeText = body.querySelector(".custom-mode-text");

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

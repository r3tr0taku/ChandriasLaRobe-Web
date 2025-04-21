document.addEventListener("DOMContentLoaded", () => {
    const body = document.querySelector("body"),
        sidebar = body.querySelector(".sidebar"),
        toggle = body.querySelector(".toggle"),
        modeSwitch = body.querySelector(".toggle-switch"),
        modeText = body.querySelector(".mode-text");
  
    // Sidebar toggle (chevron)
    if (toggle && sidebar) {
      toggle.addEventListener("click", () => {
        sidebar.classList.toggle("close");
      });
    }
  
    // Mode toggle
    if (modeSwitch && modeText) {
      modeSwitch.addEventListener("click", () => {
        body.classList.toggle("dark");
        modeText.innerText = body.classList.contains("dark") ? "Light Mode" : "Dark Mode";
      });
    }
  
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        // Remove active class from all buttons
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
  
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(tc => {
          tc.classList.remove('active');
          tc.style.display = "none";
        });
  
        // Show the selected tab content
        const tab = this.getAttribute('data-tab');
        const tabContent = document.getElementById(tab);
        if (tabContent) {
          tabContent.classList.add('active');
          tabContent.style.display = "flex";
        }
      });
    });
  
    // Set initial tab visibility
    document.querySelectorAll('.tab-content').forEach(tc => {
      if (tc.classList.contains('active')) {
        tc.style.display = "flex";
      } else {
        tc.style.display = "none";
      }
    });
  });
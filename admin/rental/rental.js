document.addEventListener("DOMContentLoaded", () => {
  const body = document.querySelector("body"),
      sidebar = body.querySelector(".sidebar"),
      toggle = body.querySelector(".toggle"),
      modeSwitch = body.querySelector(".toggle-switch"),
      modeText = body.querySelector(".mode-text"),
      logoutBtn = body.querySelector(".bxs-log-out")?.closest("a"),
      popup = document.getElementById("confirmation-popup"),
      confirmLogout = document.getElementById("confirm-logout"),
      cancelLogout = document.getElementById("cancel-logout"),
      dropdownBtn = document.getElementById("dropdownBtn"),
      dropdownContent = document.getElementById("dropdownContent"),
      fileInput = document.getElementById("fileInput"),
      uploadBox = document.getElementById("uploadBox"),
      regionSelect = document.getElementById("region"),
      citySelect = document.getElementById("city");

  // Sidebar toggle
  toggle?.addEventListener("click", () => {
      sidebar.classList.toggle("close");
  });

  // Mode switch
  modeSwitch?.addEventListener("click", () => {
      body.classList.toggle("dark");
      modeText.innerText = body.classList.contains("dark") ? "Light Mode" : "Dark Mode";
  });

  // Logout confirmation popup
  logoutBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      popup.classList.add("show");
      popup.classList.remove("hidden");
  });

  confirmLogout?.addEventListener("click", () => {
      console.log("User logged out");
      popup.classList.remove("show");
      popup.classList.add("hidden");
      window.location.href = "../authentication.html";
  });

  cancelLogout?.addEventListener("click", () => {
      popup.classList.remove("show");
      popup.classList.add("hidden");
  });

  // Dropdown toggle
  dropdownBtn?.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent document click from firing
      dropdownContent.style.display =
          dropdownContent.style.display === "block" ? "none" : "block";
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", function (e) {
      if (!dropdownBtn.contains(e.target) && !dropdownContent.contains(e.target)) {
          dropdownContent.style.display = "none";
      }
  });

  // File upload box
  fileInput?.addEventListener("change", function (e) {
      const files = Array.from(e.target.files).map(file => file.name).join(', ');
      uploadBox.innerHTML = `<p>${files}</p>`;
  });

  // Region and City dropdown population
  const regions = {
      'NCR': ['Manila', 'Quezon City', 'Makati', 'Pasig'],
      'Region I': ['Laoag', 'San Fernando', 'Vigan'],
      'Region II': ['Tuguegarao', 'Cauayan', 'Ilagan'],
      'Region III': ['Angeles', 'Balanga', 'Cabanatuan'],
      'Region IV-A': ['Antipolo', 'Batangas City', 'Lucena'],
      'Region IV-B': ['Calapan', 'Puerto Princesa'],
      'Region V': ['Legazpi', 'Naga'],
      'CAR': ['Baguio'],
      'Region VI': ['Iloilo City', 'Bacolod'],
      'Region VII': ['Cebu City', 'Tagbilaran'],
      'Region VIII': ['Tacloban', 'Ormoc'],
      'Region IX': ['Zamboanga City', 'Dipolog'],
      'Region X': ['Cagayan de Oro', 'Iligan'],
      'Region XI': ['Davao City', 'Tagum'],
      'Region XII': ['General Santos', 'Koronadal'],
      'CARAGA': ['Butuan', 'Surigao'],
      'ARMM': ['Cotabato City', 'Marawi']
  };

  if (regionSelect && citySelect) {
      Object.keys(regions).forEach(region => {
          const option = document.createElement('option');
          option.value = region;
          option.textContent = region;
          regionSelect.appendChild(option);
      });

      regionSelect.addEventListener('change', () => {
          const selectedRegion = regionSelect.value;
          const cities = regions[selectedRegion] || [];

          citySelect.innerHTML = '<option value="">Select City</option>';
          cities.forEach(city => {
              const option = document.createElement('option');
              option.value = city;
              option.textContent = city;
              citySelect.appendChild(option);
          });
      });
  }
});

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

// Get the dropdown elements
const dropdownWrapper = document.querySelector(".dropdown-wrapper");

// Toggle dropdown visibility and border styles
dropdownBtn.addEventListener("click", (event) => {
  event.stopPropagation(); // Prevent triggering the document listener
  dropdownWrapper.classList.toggle("active");
  if (dropdownWrapper.classList.contains("active")) {
    dropdownBtn.style.border = "2px solid black"; // Thick border when dropdown is active
  } else {
    dropdownBtn.style.border = "1px solid gray"; // Thin border when inactive
  }
});

// Update dropdown button text based on multiple selections
dropdownContent.addEventListener("click", (event) => {
  const clickedInput = event.target.closest("input[type='radio'], input[type='checkbox']"); // Find clicked input
  if (clickedInput) {
    // Get all checked inputs and concatenate their labels
    const selectedLabels = Array.from(dropdownContent.querySelectorAll("input:checked"))
      .map((input) => input.closest("label").textContent.trim()); // Get the labels of checked inputs
    dropdownBtn.textContent = selectedLabels.join(", ") || "Select Additional"; // Concatenate with a comma or reset text
    dropdownBtn.style.border = "2px solid black"; // Highlight the border
  }
});

// Close dropdown and reset styling when clicking outside
document.addEventListener("click", (event) => {
  if (!dropdownWrapper.contains(event.target)) {
    dropdownWrapper.classList.remove("active"); // Close the dropdown
    dropdownBtn.style.border = "1px solid gray"; // Reset border to original
  }
});


// Reset dropdown styling when clicking outside
document.addEventListener("click", (event) => {
  if (!dropdownWrapper.contains(event.target)) {
    dropdownWrapper.classList.remove("active");
    dropdownBtn.style.border = "1px solid gray"; // Reset border to thin gray
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

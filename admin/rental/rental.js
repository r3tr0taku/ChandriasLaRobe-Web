document.addEventListener("DOMContentLoaded", () => {
  // Sidebar and Mode Toggle
  const body = document.querySelector("body");
  const sidebar = body.querySelector(".sidebar");
  const toggle = body.querySelector(".toggle");
  const modeSwitch = body.querySelector(".toggle-switch");
  const modeText = body.querySelector(".mode-text");

  // Upload Box Elements
  const fileInput = document.getElementById("fileInput");
  const uploadBox = document.getElementById("uploadBox");

  // Dropdown Elements
  const dropdownWrapper = document.querySelector(".dropdown-wrapper");
  const dropdownBtn = document.getElementById("dropdownBtn");
  const dropdownContent = document.getElementById("dropdownContent");

  // Region/City Selects
  const regionSelect = document.getElementById("region");
  const citySelect = document.getElementById("city");

  // ========== Sidebar Toggle ==========
  toggle?.addEventListener("click", () => {
    sidebar.classList.toggle("close");
  });

  // ========== Mode Switch ==========
  modeSwitch?.addEventListener("click", () => {
    body.classList.toggle("dark");
    modeText.innerText = body.classList.contains("dark") ? "Light Mode" : "Dark Mode";
  });

// UPLOAD BOX

if (uploadBox && fileInput) {
  let selectedFiles = [];

  function renderFiles() {
    if (selectedFiles.length === 0) {
      uploadBox.innerHTML = `Drag your images here, or <span id="browseSpan">browse</span><br /><small>Supported: JPG, JPEG, PNG</small>`;
    } else {
      uploadBox.innerHTML = selectedFiles.map((file, idx) =>
        `<div class="uploaded-file">
          <span>${file.name}</span>
          <button type="button" class="remove-file-btn" data-idx="${idx}" title="Remove">&times;</button>
        </div>`
      ).join('') +
      `<br /><span id="browseSpan">Browse More</span><br /><small></small>`;
    }
  }

  // Initial render
  renderFiles();

  // Only open file dialog when clicking "browse"
  uploadBox.addEventListener("click", (e) => {
    if (e.target && e.target.id === "browseSpan") {
      fileInput.value = ""; // Allow re-uploading the same file
      fileInput.click();
    }
    if (e.target && e.target.classList.contains("remove-file-btn")) {
      const idx = parseInt(e.target.getAttribute("data-idx"));
      selectedFiles.splice(idx, 1);
      renderFiles();
    }
  });

  fileInput.addEventListener("change", (e) => {
    // Add new files, avoiding duplicates by name
    const newFiles = Array.from(e.target.files).filter(
      f => !selectedFiles.some(sf => sf.name === f.name && sf.size === f.size)
    );
    selectedFiles = selectedFiles.concat(newFiles);
    renderFiles();
  });
}

  // ========== Dropdown ==========
  if (dropdownBtn && dropdownContent && dropdownWrapper) {
    dropdownBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      dropdownWrapper.classList.toggle("active");
      dropdownBtn.style.border = dropdownWrapper.classList.contains("active")
        ? "2px solid black"
        : "1px solid gray";
    });

    dropdownContent.addEventListener("click", (event) => {
      const clickedInput = event.target.closest("input[type='radio'], input[type='checkbox']");
      if (clickedInput) {
        const selectedLabels = Array.from(
          dropdownContent.querySelectorAll("input:checked")
        ).map((input) =>
          input.closest("label").textContent.trim()
        );
        dropdownBtn.textContent = selectedLabels.join(", ") || "Select Additional";
        dropdownBtn.style.border = "2px solid black";
      }
    });

    document.addEventListener("click", (event) => {
      if (!dropdownWrapper.contains(event.target)) {
        dropdownWrapper.classList.remove("active");
        dropdownBtn.style.border = "1px solid gray";
      }
    });
  }

  // ========== Region and City Dropdown ==========
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

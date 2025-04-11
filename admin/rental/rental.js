document.addEventListener("DOMContentLoaded", () => {
    const body = document.querySelector("body"),
        sidebar = body.querySelector(".sidebar"),
        toggle = body.querySelector(".toggle"),
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

//ZURICH 

    function triggerFileUpload() {
        document.getElementById('fileInput').click();
      }
      
      document.getElementById('fileInput').addEventListener('change', function(e) {
        const box = document.getElementById('uploadBox');
        const files = Array.from(e.target.files).map(file => file.name).join(', ');
        box.innerHTML = `<p>${files}</p>`;
      });
      
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
      
      const regionSelect = document.getElementById('region');
      const citySelect = document.getElementById('city');
      
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
});

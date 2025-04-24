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
    btn.addEventListener('click', function () {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      document.querySelectorAll('.tab-content').forEach(tc => {
        tc.classList.remove('active');
        tc.style.display = "none";
      });
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

  // --- Cart Data ---
  const cart = {
    products: [],
    accessories: []
  };

  // --- Utility to update the cart summary ---
  function updateCartSummary() {
    // Products (Gowns) - Only display each unique product once
    const cartItemsDiv = document.querySelector('.cart-items');
    cartItemsDiv.innerHTML = '';
    const uniqueProducts = [];
    cart.products.forEach((item) => {
      if (!uniqueProducts.some(p => p.name === item.name && p.price === item.price)) {
        uniqueProducts.push(item);
      }
    });
    uniqueProducts.forEach((item, idx) => {
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <span>${item.name}</span>
        <span>
          ₱${item.price.toLocaleString()}
          <i class='bx bx-trash cart-remove' title="Remove"></i>
        </span>
      `;
      div.querySelector('.cart-remove').addEventListener('click', () => {
        // Remove all instances of this product from cart.products
        cart.products = cart.products.filter(p => !(p.name === item.name && p.price === item.price));
        // Remove excess accessories if needed
        if (cart.accessories.length > cart.products.length) {
          cart.accessories.splice(cart.products.length);
        }
        updateCartSummary();
      });
      cartItemsDiv.appendChild(div);
    });

    // Accessories (group wings and other non-accessory items)
    const cartDetailsDiv = document.querySelector('.cart-details');
    cartDetailsDiv.innerHTML = '';
    // Group non-accessory items (e.g., wings)
    const grouped = {};
    cart.accessories.forEach((item, idx) => {
      if (item.name.toLowerCase().includes('accessor')) return; // skip accessories for now
      if (!grouped[item.name]) grouped[item.name] = { ...item, count: 1, indexes: [idx] };
      else {
        grouped[item.name].count++;
        grouped[item.name].indexes.push(idx);
      }
    });
    // Render grouped non-accessory items
    Object.values(grouped).forEach(item => {
      const div = document.createElement('div');
      div.className = 'cart-row';
      div.innerHTML = `
        <span>${item.name} <span class="cart-qty-badge">x${item.count}</span></span>
        <span>
          ₱${(item.price * item.count).toLocaleString()}
          <i class='bx bx-trash cart-remove' title="Remove One"></i>
        </span>
      `;
      div.querySelector('.cart-remove').addEventListener('click', () => {
        // Remove only one instance (the first found)
        if (item.indexes.length > 0) {
          cart.accessories.splice(item.indexes[0], 1);
          updateCartSummary();
        }
      });
      cartDetailsDiv.appendChild(div);
    });
    // Render accessories (not grouped)
    cart.accessories.forEach((item, idx) => {
      if (!item.name.toLowerCase().includes('accessor')) return;
      const div = document.createElement('div');
      div.className = 'cart-row';
      let typesStr = '';
      if (item.types && item.types.length) {
        typesStr = '<ul class="cart-accessory-types">' + item.types.map(type => `<li>- ${type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}</li>`).join('') + '</ul>';
      }
      let editIcon = `<i class='bx bx-edit cart-edit' title="Edit" style="cursor:pointer;"></i>`;
      div.innerHTML = `
        <span>${item.name}${typesStr}</span>
        <span>
          ₱${item.price.toLocaleString()}
          <i class='bx bx-trash cart-remove' title="Remove"></i>
          ${editIcon}
        </span>
      `;
      div.querySelector('.cart-remove').addEventListener('click', () => {
        // Remove only this accessory
        cart.accessories.splice(idx, 1);
        updateCartSummary();
      });
      div.querySelector('.cart-edit').addEventListener('click', () => {
        showAccessoryModal(idx);
      });
      cartDetailsDiv.appendChild(div);
    });

    // Total
    const total = [...cart.products, ...cart.accessories].reduce((sum, item) => sum + item.price, 0);
    document.getElementById('cart-total-amount').textContent = `₱${total.toLocaleString()}`;
  }

  // --- Add click listeners to product cards ---
  document.querySelectorAll('#products .pos-card').forEach(card => {
    card.addEventListener('click', function () {
      const name = card.querySelector('.pos-name').textContent;
      const price = parseInt(card.querySelector('.pos-price').textContent.replace(/[^\d]/g, ''));
      // Only add if not already in cart
      if (cart.products.some(p => p.name === name && p.price === price)) {
        showErrorModal('This product is already in the cart.');
        return;
      }
      cart.products.push({ name, price });
      updateCartSummary();
    });
  });

  // --- Accessory Modal Logic ---
  const accessoryModal = document.getElementById('accessory-modal');
  const closeModalBtn = document.querySelector('.close-modal');
  const saveAccessoryTypesBtn = document.getElementById('save-accessory-types');
  const accessoryForm = document.getElementById('accessory-form');
  let pendingAccessoryIdx = null;

  function showAccessoryModal(idx) {
    accessoryModal.style.display = 'block';
    pendingAccessoryIdx = idx;
    // Reset checkboxes
    accessoryForm.querySelectorAll('input[type=checkbox]').forEach(cb => cb.checked = false);
    // If already has types, check them
    if (cart.accessories[idx] && cart.accessories[idx].types) {
      cart.accessories[idx].types.forEach(type => {
        const cb = accessoryForm.querySelector(`input[value="${type}"]`);
        if (cb) cb.checked = true;
      });
    }
  }
  closeModalBtn.onclick = () => { accessoryModal.style.display = 'none'; };
  saveAccessoryTypesBtn.onclick = (e) => {
    e.preventDefault();
    if (pendingAccessoryIdx !== null && cart.accessories[pendingAccessoryIdx]) {
      const types = Array.from(accessoryForm.querySelectorAll('input[type=checkbox]:checked')).map(cb => cb.value);
      cart.accessories[pendingAccessoryIdx].types = types;
      updateCartSummary();
    }
    accessoryModal.style.display = 'none';
  };
  window.onclick = function(event) {
    if (event.target == accessoryModal) accessoryModal.style.display = 'none';
  };

  // --- Select All Accessories logic ---
  const selectAll = document.getElementById('select-all-accessories');
  if (selectAll && accessoryForm) {
    selectAll.addEventListener('change', function() {
      const checkboxes = accessoryForm.querySelectorAll('input[name="accessoryType"]');
      checkboxes.forEach(cb => cb.checked = selectAll.checked);
    });
    accessoryForm.addEventListener('change', function(e) {
      if (e.target.name === 'accessoryType') {
        const checkboxes = accessoryForm.querySelectorAll('input[name="accessoryType"]');
        selectAll.checked = Array.from(checkboxes).every(cb => cb.checked);
      }
    });
  }

  // --- Add click listeners to accessory cards (Additional tab) ---
  document.querySelectorAll('#accessories .pos-card').forEach(card => {
    card.addEventListener('click', function () {
      const name = card.querySelector('.pos-name').textContent;
      const price = parseInt(card.querySelector('.pos-price').textContent.replace(/[^\d]/g, ''));
      // Count how many of this item are already in the cart
      const countOfThis = cart.accessories.filter(item => item.name === name).length;
      // Count how many of this product are in the cart
      const productCount = cart.products.length;
      if (countOfThis >= productCount) {
        showErrorModal(`You can only add as many '${name}' as products selected.`);
        return;
      }
      // If it's an accessory (not wings), add to cart with empty types, but do NOT show modal
      if (name.toLowerCase().includes('accessor') || name.toLowerCase().includes('accessories')) {
        cart.accessories.push({ name, price, types: [] });
        updateCartSummary();
      } else {
        // For wings or other items, add directly
        cart.accessories.push({ name, price });
        updateCartSummary();
      }
    });
  });

  // --- Initialize cart summary on load ---
  updateCartSummary();

  // --- Error Modal Logic ---
  const errorModal = document.getElementById('error-modal');
  const errorModalMsg = document.getElementById('error-modal-message');
  const errorModalOk = document.getElementById('error-modal-ok');
  const errorModalClose = document.querySelector('.error-close');

  function showErrorModal(message) {
    if (errorModal && errorModalMsg) {
      errorModalMsg.textContent = message;
      errorModal.style.display = 'block';
    }
  }
  if (errorModalOk) errorModalOk.onclick = () => errorModal.style.display = 'none';
  if (errorModalClose) errorModalClose.onclick = () => errorModal.style.display = 'none';
  window.addEventListener('click', function(event) {
    if (event.target === errorModal) errorModal.style.display = 'none';
  });

  // --- Product & Accessory Search Functionality ---
  const searchInput = document.querySelector('.pos-search-bar input[type="text"]');
  function filterCards() {
    const query = searchInput.value.trim().toLowerCase();
    // Helper: normalize price for matching
    function normalizePrice(str) {
      return str.replace(/[^\d]/g, ''); // digits only
    }
    // Helper: allow matching with or without commas
    function priceMatches(priceText, query) {
      const priceDigits = normalizePrice(priceText);
      const queryDigits = normalizePrice(query);
      return (
        priceText.toLowerCase().includes(query) ||
        priceDigits.includes(queryDigits)
      );
    }
    // Filter product cards
    document.querySelectorAll('#products .pos-card').forEach(card => {
      const name = card.querySelector('.pos-name').textContent.toLowerCase();
      const priceText = card.querySelector('.pos-price').textContent;
      if (name.includes(query) || priceMatches(priceText, query)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
    // Filter accessory cards
    document.querySelectorAll('#accessories .pos-card').forEach(card => {
      const name = card.querySelector('.pos-name').textContent.toLowerCase();
      const priceText = card.querySelector('.pos-price').textContent;
      if (name.includes(query) || priceMatches(priceText, query)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  }
  if (searchInput) {
    searchInput.addEventListener('input', filterCards);
    // Optional: also filter on search icon click
    const searchIcon = document.querySelector('.pos-search-bar .search-icon');
    if (searchIcon) searchIcon.addEventListener('click', filterCards);
  }

  // --- Customer Modal Logic ---
  const customerModal = document.getElementById('customer-modal');
  const customerClose = document.querySelector('.customer-close');
  const customerForm = document.getElementById('customer-form');
  const rentalFeeField = document.getElementById('client-rental-fee');
  const checkoutBtn = document.getElementById('cart-checkout-btn');
  const cartTotalAmount = document.getElementById('cart-total-amount');

  if (checkoutBtn && customerModal) {
    checkoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      // Check if there is at least one product in the cart
      if (!cart.products.length) {
        showErrorModal('Please add at least one product to the cart before proceeding.');
        return;
      }
      // Set rental fee from cart summary
      if (rentalFeeField && cartTotalAmount) {
        rentalFeeField.value = cartTotalAmount.textContent || '';
      }
      customerModal.style.display = 'block';
    });
  }
  if (customerClose) customerClose.onclick = () => customerModal.style.display = 'none';
  window.addEventListener('click', function(event) {
    if (event.target === customerModal) customerModal.style.display = 'none';
  });
  customerForm && customerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    // You can handle form submission here (e.g., send data to backend)
    customerModal.style.display = 'none';
    showErrorModal('Customer form submitted! (Demo only)'); // Replace with success modal or real logic
  });

  // --- Customer Modal Luzon Regions and City Logic ---
  const luzonRegions = {
    'Region I': ['Laoag', 'Vigan', 'San Fernando', 'Alaminos', 'Batac', 'Candon', 'Urdaneta', 'Dagupan', 'San Carlos', 'Rosales', 'Agoo', 'Bauang', 'Sual', 'Pozorrubio', 'Lingayen', 'Bayambang', 'Sison', 'Sto. Tomas', 'Bani', 'Burgos', 'Agno'],
    'Region II': ['Tuguegarao', 'Cauayan', 'Ilagan', 'Santiago', 'Bayombong', 'Solano', 'Aparri', 'Roxas', 'Naguilian', 'Cabagan', 'Tumauini', 'San Mateo', 'Echague', 'Jones', 'Alicia', 'San Mariano', 'Gamu', 'San Pablo', 'Maddela', 'Diffun'],
    'Region III': ['San Fernando', 'Angeles', 'Olongapo', 'Balanga', 'Cabanatuan', 'Gapan', 'Malolos', 'Meycauayan', 'San Jose del Monte', 'Tarlac City', 'Mabalacat', 'Palayan', 'San Jose', 'Bocaue', 'Marilao', 'Baliuag', 'Guiguinto', 'Plaridel', 'Sta. Maria', 'San Miguel', 'San Rafael'],
    'Region IV-A': ['Calamba', 'Antipolo', 'Batangas City', 'Lucena', 'Tanauan', 'Lipa', 'San Pablo', 'Tayabas', 'Cavite City', 'Tagaytay', 'Trece Martires', 'Dasmariñas', 'Imus', 'Bacoor', 'Binan', 'Cabuyao', 'San Pedro', 'Sta. Rosa', 'San Mateo', 'Rodriguez'],
    'Region IV-B': ['Calapan', 'Puerto Princesa', 'Romblon', 'Boac', 'Mamburao', 'San Jose', 'Sablayan', 'Roxas', 'Bongabong', 'Pinamalayan', 'Naujan', 'Victoria', 'Aborlan', 'Brooke’s Point', 'Coron', 'El Nido', 'Rizal', 'Bataraza', 'Narra', 'Quezon'],
    'Region V': ['Legazpi', 'Naga', 'Sorsogon', 'Iriga', 'Tabaco', 'Ligao', 'Masbate City', 'Daet', 'Tigaon', 'Polangui', 'Libmanan', 'Pili', 'Sorsogon City', 'Bulusan', 'Donsol', 'Gubat', 'Jovellar', 'Bulan', 'Irosin', 'Matnog', 'Barcelona'],
    'NCR': ['Manila', 'Quezon City', 'Caloocan', 'Las Piñas', 'Makati', 'Malabon', 'Mandaluyong', 'Marikina', 'Muntinlupa', 'Navotas', 'Parañaque', 'Pasay', 'Pasig', 'Pateros', 'San Juan', 'Taguig', 'Valenzuela'],
    'CAR': ['Baguio', 'Tabuk', 'Bangued', 'La Trinidad', 'Bontoc', 'Lagawe', 'Kiangan', 'Banaue', 'Sagada', 'Sabangan', 'Tadian', 'Besao', 'Paracelis', 'Natonin', 'Barlig', 'Sadanga', 'Sabangan', 'Tadian', 'Besao', 'Paracelis', 'Natonin']
  };
  const regionSelect = document.getElementById('client-region');
  const citySelect = document.getElementById('client-city');
  if (regionSelect && citySelect) {
    regionSelect.innerHTML = '<option value="">Select Region</option>' +
      Object.keys(luzonRegions).map(region => `<option value="${region}">${region}</option>`).join('');
    regionSelect.addEventListener('change', function() {
      const cities = luzonRegions[this.value] || [];
      citySelect.innerHTML = '<option value="">Select City</option>' +
        cities.map(city => `<option value="${city}">${city}</option>`).join('');
    });
    // Always set city dropdown to 'Select City' by default
    citySelect.innerHTML = '<option value="">Select City</option>';
  }
  // --- Auto-fill Product Code, Additional, Rental Fee ---
  function updateCustomerModalFields() {
    // Concatenate all product names/codes in the cart
    const productCodes = cart.products.map(p => p.name).join(', ');
    document.getElementById('client-product-code').value = productCodes;
    // Additional: list accessories/wings with quantity
    let additionalArr = [];
    // Count wings
    const wingsCount = cart.accessories.filter(a => a.name.toLowerCase().includes('wing')).length;
    if (cart.accessories.some(a => a.name.toLowerCase().includes('accessor'))) additionalArr.push('Accessory');
    if (wingsCount > 0) additionalArr.push(`Wings${wingsCount > 1 ? ' x' + wingsCount : ''}`);
    document.getElementById('client-additional').value = additionalArr.join(', ');
    // Rental Fee
    document.getElementById('client-rental-fee').value = document.getElementById('cart-total-amount').textContent || '';
  }
  if (checkoutBtn && customerModal) {
    checkoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (!cart.products.length) {
        showErrorModal('Please add at least one product to the cart before proceeding.');
        return;
      }
      updateCustomerModalFields();
      customerModal.style.display = 'block';
    });
  }
  // --- Restrict Client Contact to Numbers Only ---
  const clientContact = document.getElementById('client-contact');
  if (clientContact) {
    clientContact.addEventListener('input', function() {
      this.value = this.value.replace(/[^0-9]/g, '');
    });
  }
});
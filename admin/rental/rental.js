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
        alert('This product is already in the cart.');
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
        alert(`You can only add as many '${name}' as products selected.`);
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
});
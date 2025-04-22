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
    // Products (Gowns)
    const cartItemsDiv = document.querySelector('.cart-items');
    cartItemsDiv.innerHTML = '';
    cart.products.forEach((item, idx) => {
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
        cart.products.splice(idx, 1);
        updateCartSummary();
      });
      cartItemsDiv.appendChild(div);
    });

    // Accessories
    const cartDetailsDiv = document.querySelector('.cart-details');
    cartDetailsDiv.innerHTML = '';
    cart.accessories.forEach((item, idx) => {
      const div = document.createElement('div');
      div.className = 'cart-row';
      div.innerHTML = `
        <span>${item.name}</span>
        <span>
          ₱${item.price.toLocaleString()}
          <i class='bx bx-trash cart-remove' title="Remove"></i>
        </span>
      `;
      div.querySelector('.cart-remove').addEventListener('click', () => {
        cart.accessories.splice(idx, 1);
        updateCartSummary();
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
      cart.products.push({ name, price });
      updateCartSummary();
    });
  });

  // --- Add click listeners to accessory cards ---
  document.querySelectorAll('#accessories .pos-card').forEach(card => {
    card.addEventListener('click', function () {
      const name = card.querySelector('.pos-name').textContent;
      const price = parseInt(card.querySelector('.pos-price').textContent.replace(/[^\d]/g, ''));
      cart.accessories.push({ name, price });
      updateCartSummary();
    });
  });

  // --- Initialize cart summary on load ---
  updateCartSummary();
});